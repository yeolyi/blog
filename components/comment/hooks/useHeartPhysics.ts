'use client';

import {
	Bodies,
	Body,
	Composite,
	Engine,
	Events,
	Mouse,
	MouseConstraint,
	Runner,
} from 'matter-js';
import { minidenticon } from 'minidenticons';
import { useCallback, useRef } from 'react';

export const HEIGHT = 240;

export function useHeartPhysics() {
	const heartPhysicsRef = useRef<HeartPhysics | null>(null);

	return {
		containerRef: useCallback((ref: HTMLDivElement) => {
			heartPhysicsRef.current = new HeartPhysics(ref);
			return () => {
				heartPhysicsRef.current?.destroy();
			};
		}, []),
		dropBall: useCallback((userId: string) => {
			heartPhysicsRef.current?.dropBall(userId);
		}, []),
	};
}

class HeartPhysics {
	container: HTMLDivElement;
	engine: Engine = Engine.create();
	runner: Runner = Runner.create();
	ballIdToElement: Map<number, HTMLImageElement> = new Map();
	handleMouseUp!: () => void;
	resizeObserver!: ResizeObserver;
	boundaries: Body[] = [];
	currentWidth: number;

	constructor(container: HTMLDivElement) {
		this.container = container;
		this.currentWidth = container.clientWidth;

		this.initializePhysics();
		this.setupResizeObserver();
	}

	private initializePhysics() {
		const WIDTH = this.currentWidth;

		// 바닥과 벽 생성
		this.createBoundaries(WIDTH);

		// 마우스 컨트롤 설정
		const mouse = Mouse.create(this.container);
		const mouseConstraint = MouseConstraint.create(this.engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.2,
				render: { visible: false },
			},
		});

		// @ts-expect-error https://github.com/liabru/matter-js/issues/929
		mouse.element.removeEventListener('wheel', mouse.mousewheel);

		// 마우스 이벤트 리스너 설정
		this.handleMouseUp = () => {
			mouse.button = -1;
			mouse.element.dispatchEvent(new MouseEvent('mouseup'));
		};
		addEventListener('mouseup', this.handleMouseUp);

		// 모든 정적 요소들을 월드에 추가
		Composite.add(this.engine.world, [...this.boundaries]);
		Composite.add(this.engine.world, mouseConstraint);

		// 물리 업데이트시 DOM 직접 업데이트
		Events.on(this.engine, 'afterUpdate', () => {
			this.engine.world.bodies.forEach((body) => {
				// 정적 바디(벽, 바닥)는 제외
				if (body.isStatic) return;

				const element = this.ballIdToElement.get(body.id);
				if (element) {
					// 직접 DOM 스타일 업데이트
					element.style.left = `${body.position.x - 20}px`;
					element.style.top = `${body.position.y - 20}px`;
					element.style.transform = `rotate(${body.angle}rad)`;
				}
			});
		});

		// https://github.com/liabru/matter-js/issues/840
		Events.on(this.engine, 'beforeUpdate', (event) => {
			event.source.world.bodies.forEach((body) => {
				const maxSpeed = 25;
				Body.setVelocity(body, {
					x: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.x)),
					y: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.y)),
				});
			});
		});

		// 러너 생성 및 시작 (물리 시뮬레이션만)
		Runner.run(this.runner, this.engine);
	}

	private createBoundaries(width: number) {
		const WALL_DEPTH = 999;
		this.boundaries = [
			// 바닥
			Bodies.rectangle(width / 2, HEIGHT + WALL_DEPTH / 2, width, WALL_DEPTH, {
				isStatic: true,
				render: { fillStyle: '#444444' },
			}),
			// 왼쪽 벽
			Bodies.rectangle(-WALL_DEPTH / 2, HEIGHT / 2, WALL_DEPTH, HEIGHT, {
				isStatic: true,
				render: { fillStyle: '#444444' },
			}),
			// 오른쪽 벽
			Bodies.rectangle(width + WALL_DEPTH / 2, HEIGHT / 2, WALL_DEPTH, HEIGHT, {
				isStatic: true,
				render: { fillStyle: '#444444' },
			}),
			// 위쪽 벽
			Bodies.rectangle(width / 2, -WALL_DEPTH / 2, width, WALL_DEPTH, {
				isStatic: true,
				render: { fillStyle: '#444444' },
			}),
		];
	}

	private setupResizeObserver() {
		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newWidth = entry.contentRect.width;
				if (newWidth !== this.currentWidth && newWidth > 0) {
					this.handleResize(newWidth);
				}
			}
		});
		this.resizeObserver.observe(this.container);
	}

	private handleResize(newWidth: number) {
		// 기존 벽들 제거
		Composite.remove(this.engine.world, this.boundaries);

		// 새로운 크기로 벽들 재생성
		this.createBoundaries(newWidth);
		Composite.add(this.engine.world, this.boundaries);

		// 컨테이너가 작아질 때만 구슬들을 오른쪽 벽 안쪽으로 밀어넣기
		if (newWidth < this.currentWidth) {
			const rightBoundary = newWidth - 20; // 구슬 반지름만큼 여유 공간

			this.engine.world.bodies.forEach((body) => {
				if (!body.isStatic && body.position.x > rightBoundary) {
					// 오른쪽 벽에 밀려서 안쪽으로 이동
					Body.setPosition(body, {
						x: rightBoundary,
						y: body.position.y,
					});

					// 약간의 왼쪽 방향 속도 추가 (밀리는 효과)
					Body.setVelocity(body, {
						x: -Math.abs(body.velocity.x) - 2,
						y: body.velocity.y,
					});
				}
			});
		}

		this.currentWidth = newWidth;
	}

	destroy() {
		// ResizeObserver 정리
		this.resizeObserver.disconnect();

		removeEventListener('mouseup', this.handleMouseUp);
		Runner.stop(this.runner);
		Engine.clear(this.engine);

		this.ballIdToElement.forEach((element) => {
			element.remove();
		});
		this.ballIdToElement.clear();
	}

	#createIdentityIcon(userId: string) {
		const svgText = minidenticon(userId, 80, 50);

		const img = document.createElement('img');
		img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
		img.alt = userId;
		img.className =
			'absolute bg-white border-2 border-border rounded-full cursor-pointer select-none';
		img.style.width = '40px';
		img.style.height = '40px';
		img.draggable = false;

		this.container.appendChild(img);
		return img;
	}

	// 구슬 떨어뜨리기 함수
	async dropBall(userId: string) {
		const ball = Bodies.circle(
			40, // 좌측
			40, // 상단
			20, // 구슬 크기
			{
				restitution: 0.9, // 탄성
			},
		);

		// IdentityIcon 생성
		const element = this.#createIdentityIcon(userId);
		element.style.left = '20px';
		element.style.top = '20px';

		// ball.id를 키로 직접 element 저장
		this.ballIdToElement.set(ball.id, element);

		// 물리 세계에 구슬 추가
		Composite.add(this.engine.world, ball);
	}
}
