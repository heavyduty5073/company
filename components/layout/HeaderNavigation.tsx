'use client'
import React from 'react';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { MenuItemComponent } from './NavigationMenuItem';
import {MenuItem, menus} from "@/lib/menus";

function HeaderNavigation() {
    return (
        <NavigationMenu className="mx-auto py-2">
            <NavigationMenuList className="flex gap-6 justify-center">
                {menus.map((menuItem:MenuItem) => (
                    <MenuItemComponent key={menuItem.id} item={menuItem} />
                ))}
            </NavigationMenuList>

            <NavigationMenuViewport className="bg-white" />
        </NavigationMenu>
    );
}

export default HeaderNavigation;