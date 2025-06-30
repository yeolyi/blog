'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useMemory } from './hooks/useMemory';

export function Memory() {
  const { memory, readValue, lastReadAddress, handleWrite, handleRead } =
    useMemory({ size: 4 });

  const [operation, setOperation] = useState<'read' | 'write'>('read');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const address = Number.parseInt(formData.get('address') as string, 10);

    if (operation === 'read') {
      handleRead(address);
    } else {
      const data = Number.parseInt(formData.get('data') as string, 10);
      const result = handleWrite(address, data);
      if (result.success) {
        form.reset();
      } else {
        alert(result.message);
      }
    }
  };

  console.log(memory);

  return (
    <div className="my-8 not-prose">
      <div className="flex flex-col gap-4">
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>메모리 시뮬레이터</CardTitle>
              <CardDescription>
                주소를 사용해 데이터를 읽고 써보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>주소</TableHead>
                    <TableHead>데이터</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memory.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell>{index}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <RadioGroup
                value={operation}
                onValueChange={(value: 'read' | 'write') => setOperation(value)}
                className="grid-flow-col"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="read" id="read" />
                  <Label htmlFor="read">읽기</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="write" id="write" />
                  <Label htmlFor="write">쓰기</Label>
                </div>
              </RadioGroup>

              <div className="flex flex-col gap-3">
                <Label>주소</Label>
                <RadioGroup
                  defaultValue="0"
                  name="address"
                  className="grid-flow-col max-w-sm"
                >
                  {memory.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={index.toString()}
                      />
                      <Label htmlFor={index.toString()}>{index}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {operation === 'write' && (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="data">데이터</Label>
                  <Input
                    name="data"
                    type="number"
                    min="0"
                    max="255"
                    className="max-w-sm"
                    placeholder="0~255"
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="space-x-3">
              <Button type="submit">
                {operation === 'read' ? <Eye /> : <Pencil />}
                {operation === 'read' ? '읽기' : '쓰기'}
              </Button>
              {operation === 'read' && (
                <p>
                  {lastReadAddress ?? ' - '}번 주소의 값은 {readValue ?? ' - '}
                  입니다.
                </p>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
