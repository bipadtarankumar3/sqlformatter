import ValidatorClient from './validator-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Validator & Safety Shield - Check SQL Syntax',
  description: 'Validate SQL query syntax and scan for potential data threats (unbounded deletes, drops) entirely in your browser.',
  path: '/validator',
});

export default function ValidatorPage() {
  return <ValidatorClient />;
}
