import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';

type SelectableProperty = {
  id: string;
  name: string;
  address: string | null;
  city: string;
};

type Props = {
  properties: SelectableProperty[];
};

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export default function SelectProperty({ properties }: Props) {
  return (
    <>
      <Head title="Select a property" />

      <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-8 px-6 py-12">
        <div className="flex items-center justify-center">
          <AppLogo />
        </div>

        <Card className="overflow-hidden py-0">
          <CardHeader className="border-b py-5">
            <CardTitle>Select a property</CardTitle>
            <CardDescription>
              You manage more than one property. Choose which one to open.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <ItemGroup>
              {properties.map((property, index) => (
                <>
                  {index > 0 && <ItemSeparator />}

                  <Item
                    key={property.id}
                    size="sm"
                    render={<a href={`/properties/${property.id}/dashboard`} />}
                    className="px-6"
                  >
                    <ItemMedia>
                      <Avatar className="size-9 rounded-md">
                        <AvatarFallback className="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                          {initials(property.name)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>{property.name}</ItemTitle>
                      <ItemDescription>
                        {property.address ? `${property.address}, ` : ''}
                        {property.city}
                      </ItemDescription>
                    </ItemContent>

                    <ItemActions>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </ItemActions>
                  </Item>
                </>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
