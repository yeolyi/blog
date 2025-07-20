#include <stdio.h>

int main() {
  int a = 10;
  int *p = &a;
  printf("%p\n", p);   // 0x16ef06ca8
  printf("%d\n", *p);  // 10
  return 0;
}