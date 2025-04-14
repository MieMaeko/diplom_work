import { useRouter } from 'next/router';
import Catalog from '../page';
export default function CategoryPage() {
  const router = useRouter();
  const { type, category } = router.query;

  return <Catalog category={category as string} />;
}
