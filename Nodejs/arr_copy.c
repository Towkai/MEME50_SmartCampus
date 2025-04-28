#include <stdio.h>

int main(void)
{
    int n, arr1[100], arr2[100];

    printf("Input how many elements you want to insert: ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++)
    {
        printf("element_%d : ", i);
        scanf("%d", &arr1[i]);
    }

    for (int i = 0; i < n; i++)
    {
        arr2[i] = arr1[i];
    }

    printf("Arr1 elements: ");
    for (int i = 0; i < n; i++)
    {
        printf("%d ", arr1[i]);
    }

    printf("\n");

    printf("Arr2 elements: ");
    for (int i = 0; i < n; i++)
    {
        printf("%d ", arr2[i]);
    }
}