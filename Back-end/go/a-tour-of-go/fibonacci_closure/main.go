package main

import "fmt"

// fibonacci is a function that returns
// a function that returns an int.
// fibonacci number suqueses -> 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233...
func fibonacci() func() int {
	a, b := 1, 0
	return func() int {
		a, b = b, a+b
		return a
	}
}

func main() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}
