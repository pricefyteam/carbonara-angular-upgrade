const ROLE_MN_PIM = "MN-GERENCIAMENTO-PIM";

interface MenuInterface {
    text: string;
    translate: string;
    icon: string;
    link: string;
    roles: string[];
}

const MENU_PRODUTOS: MenuInterface = {
    text: "Produtos",
    translate: "PRODUCTS",
    icon: "fa fa-light fa-bottle-water",
    link: "/produtos",
    roles: [ROLE_MN_PIM],
};

const MENU_FAMILIAS: MenuInterface = {
    text: "Familias",
    translate: "FAMILIES",
    icon: "fak fa-fami-lia-de-ofertas",
    link: "/familias",
    roles: [ROLE_MN_PIM],
};

const MENU_BANCO_IMAGENS: MenuInterface = {
    text: "Banco de imagens",
    translate: "IMAGES",
    icon: "fa fa-light fa-images",
    link: "/banco-de-imagens",
    roles: [ROLE_MN_PIM],
};

const MENU_PIM: MenuInterface[] = [MENU_PRODUTOS, MENU_FAMILIAS, MENU_BANCO_IMAGENS];

export class AppMenus {
    public static menus(): MenuInterface[] {
        return MENU_PIM;
    }
}
