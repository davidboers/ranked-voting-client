#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/* Generates a random password, composed of between 8 and 26 characters, numbers and letters (uppercase and lowercase).
 * Even one of the shorter passwords will take years to guess.
 */

int main(void)
{
    srand(time(NULL));

    const int max_len = 26;
    const int min_len = 8;
    const int length = rand() % (max_len - min_len + 1) + min_len;

    const int no_chars = 26 + 26 + 10;
    char bank[no_chars];
    int n_char = 0;
    for (char c = 'A'; c <= 'Z'; c++)
    {
        bank[n_char] = c;
        n_char++;
    }
    for (char c = 'a'; c <= 'z'; c++)
    {
        bank[n_char] = c;
        n_char++;
    }
    for (char c = '0'; c <= '9'; c++)
    {
        bank[n_char] = c;
        n_char++;
    }

    char password[length];

    for (int i = 0; i < length; i++)
    {
        char c = bank[rand() % no_chars];
        password[i] = c;
        printf("%c", c);
    }
}