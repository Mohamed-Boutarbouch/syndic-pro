import { CoOwnersCards } from '@/components/co-owners/co-owners-cards';
import { ActiveSyndic } from '@/components/co-owners/active-syndic';

export default function CoOwnersPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <CoOwnersCards />

      <div className="px-4 lg:px-6">
        <ActiveSyndic />
      </div>

      {/*<div className="px-4 lg:px-6">
        <CollectionProgress />
      </div>*/}
    </div>
  );
}
