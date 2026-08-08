# Sizzle Label Project

A Vite, React, TypeScript, shadcn/ui, and Tailwind CSS application for creating food labels and menus.

## Sites

- Production: https://dbgpdp09px7we.cloudfront.net
- Development: https://dyanji58pub4g.cloudfront.net

## Local development

Node.js 20 or newer is required.

```sh
npm ci
cp .env.example .env
npm run dev
```

Create a production build with:

```sh
npm run build
```

## Supabase and OpenAI configuration

The browser reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` at
build time. For local development, copy `.env.example` to `.env` and fill in
the values. `.env` is ignored by Git. Publishable keys are visible in the
built browser application by design, so database access must still be
protected with Row Level Security.

Translation runs in the `translate` Supabase Edge Function. Its OpenAI API key
must be stored as a Supabase project secret, never in a Vite variable or local
`.env` file:

```sh
supabase secrets set OPENAI_API_KEY=your-key
supabase functions deploy translate
```

Rotate an OpenAI key immediately if it has previously been committed to Git.

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
| `VITE_SUPABASE_URL` | Supabase project URL used by the browser build |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key used by the browser build |

The hosting infrastructure is defined in `infrastructure/aws-static-site.yml`. Each environment uses its own CloudFormation stack, bucket, CloudFront distribution, and branch-restricted IAM role.
