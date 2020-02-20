package main

import (
	"fmt"
)

/*
ニュートン法
問題：https://go-tour-jp.appspot.com/flowcontrol/8
標準ライブラリの math.Sqrt にどれくらい近くか、10よりも先か
*/
func Sqrt(x float64) float64 {
	z := 1.0
	for i := 1.0; i*i > 1e-10; z -= i {
		i -= (z*z - x) / (2 * z)
		fmt.Println(z)
	}
	return z
}

func main() {
	fmt.Println(Sqrt(2))
}
