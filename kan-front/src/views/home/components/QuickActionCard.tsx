'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function QuickActionCard({
  href,
  title,
  description,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
