provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins_sg_2"
  description = "Security group for Jenkins instance"

  ingress = [
        for port in [22, 80, 443, 8080, 9000, 3000] : {
            description      = "inbound rules"
            from_port        = port
            to_port          = port
            protocol         = "tcp"
            cidr_blocks      = ["0.0.0.0/0"]
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            security_groups  = []
            self             = false
        }
  ]

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "jenkins" {
  ami           = "ami-0bb84b8ffd87024d8"
  instance_type = "t2.micro"
  user_data     = file("install.sh")

  key_name = "key_amazon"

  security_groups = [aws_security_group.jenkins_sg.name]

  tags = {
    Name = "JenkinsInstance"
  }
}

output "instance_id" {
  value = aws_instance.jenkins.id
}

output "instance_public_ip" {
  value = aws_instance.jenkins.public_ip
}
