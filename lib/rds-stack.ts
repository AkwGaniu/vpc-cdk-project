import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface RdsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class RdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    const dbInstance = new rds.DatabaseInstance(this, 'MyRDSInstance', {
      vpc: props.vpc,
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_42,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpcSubnets: {
        subnetGroupName: 'DatabaseSubnet',
        // subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        // availabilityZones: [ props.vpc.availabilityZones[2] ],
      },
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 30, // should be able to scale up to 30GB
      storageType: rds.StorageType.GP2,
      publiclyAccessible: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(7),
      deleteAutomatedBackups: true,
      deletionProtection: false, // Deletion protection disabled
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    cdk.Tags.of(dbInstance).add('Name', 'MyRDSInstance');

    new cdk.CfnOutput(this, 'RDSInstanceEndpoint', {
      value: dbInstance.dbInstanceEndpointAddress,
      description: 'The endpoint address of the RDS instance',
    });
  }
}