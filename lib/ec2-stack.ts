import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

// Props
interface Ec2StackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props);

    const instance1 = new ec2.Instance(this, 'MyPrivateEC2-AZ1', {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        availabilityZones: [props.vpc.availabilityZones[0]],
      },
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    });

    const instance2 = new ec2.Instance(this, 'MyPrivateEC2-AZ2', {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        availabilityZones: [props.vpc.availabilityZones[1]],
      },
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    });

    cdk.Tags.of(instance1).add('Name', 'MyPrivateEC2-AZ1');
    cdk.Tags.of(instance2).add('Name', 'MyPrivateEC2-AZ2');
  }
}

