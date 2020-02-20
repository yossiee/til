# A Tour of Go

<img src="https://www.techscore.com/blog/wp/wp-content/uploads/2016/12/gopher_fiveyears.jpg" style="max-width: 500px;">

The following is a quote from this [forked repository](https://github.com/yoshimitsuEgashira/go-tour-jp).

this is directory structure in this repository. In order words, it shows a list of exercises.

```
src/
├── equivalent_binary_trees
├── errors
├── fibonacci_closure
├── images
├── loops_and_functions
├── maps
├── readers
├── rot13Reader
├── slices
├── strings
└── web_crawler
```

A Tour of Go is an introduction to the Go programming language.(https://go-tour-jp.appspot.com/)

The easiest way to install the tour locally is to install
[a binary release of Go](https://golang.org/dl/) and then run:

	$ go tool tour

To install the tour from source, first 
[set up a workspace](https://golang.org/doc/code.html) and then run:

	$ go get github.com/atotto/go-tour-jp/gotour

This will place a `gotour` binary in your workspace's `bin` directory.

Unless otherwise noted, the go-tour source files are distributed
under the BSD-style license found in the LICENSE file.

Contributions should follow the same procedure as for the Go project:
https://golang.org/doc/contribute.html
