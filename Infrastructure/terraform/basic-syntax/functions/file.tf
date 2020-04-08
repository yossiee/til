resource "aws_instance" "example" {
  ami                    = "ami-03fd0f5d33134a76"
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.example_ec2.id]
  user_data = file("./user_data.sh")
}
