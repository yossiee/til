variable "example_instance_type" {
  default = "t3.micro"
}

# local variable
locals {
  example_instance_type = "t3.micro"
}

resource "aws_instance" "example" {
  ami           = "ami-0c3fd0f5d33134a76"
  instance_type = var.example_instance_type
}

# check the output value or get from modules
output "example_instance_id" {
  value = aws_instance.example.id
}
