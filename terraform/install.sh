#!/bin/bash
set -e

# Update package list
sudo yum update -y

# Install Amazon Corretto 11 (OpenJDK 11)
sudo yum install java-11-amazon-corretto -y
java --version
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-amazon-corretto' | sudo tee -a /etc/profile
source /etc/profile

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Run SonarQube as a Docker container
sudo docker run -d --name sonar -p 9000:9000 sonarqube:lts-community

# Install Git (required for Jenkins)
sudo yum install -y git

# Install Trivy
sudo rpm -ivh https://github.com/aquasecurity/trivy/releases/download/v0.33.0/trivy_0.33.0_Linux-64bit.rpm

# Print Jenkins initial admin password
echo "Jenkins initial admin password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword