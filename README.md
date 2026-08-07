# Sizzle Label Project

A Vite, React, TypeScript, shadcn/ui, and Tailwind CSS application for creating food labels and menus.

## Sites

- Production: https://dbgpdp09px7we.cloudfront.net
- Development: https://dyanji58pub4g.cloudfront.net

## Local development

Node.js 20 or newer is required.

```sh
npm ci
npm run dev
```

Create a production build with:

```sh
npm run build
```

## Automatic AWS deployment

GitHub Actions builds and deploys the app to private S3 buckets served through CloudFront. Authentication uses GitHub OIDC, so GitHub does not store permanent AWS access keys.

- Pushes to `main` deploy production using `.github/workflows/deploy-aws.yml`.
- Pushes to `development` deploy development using `.github/workflows/deploy-aws-development.yml`.

Configure these GitHub Actions repository variables under **Settings → Secrets and variables → Actions → Variables**:

| Variable | Purpose |
| --- | --- |
| `AWS_REGION` | AWS region, currently `eu-north-1` |
| `AWS_ROLE_ARN` | Production deployment-role ARN |
| `AWS_S3_BUCKET` | Production bucket name |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Production CloudFront distribution ID |
| `AWS_DEV_ROLE_ARN` | Development deployment-role ARN |
| `AWS_DEV_S3_BUCKET` | Development bucket name |
| `AWS_DEV_CLOUDFRONT_DISTRIBUTION_ID` | Development CloudFront distribution ID |

The hosting infrastructure is defined in `infrastructure/aws-static-site.yml`. Each environment uses its own CloudFormation stack, bucket, CloudFront distribution, and branch-restricted IAM role.
