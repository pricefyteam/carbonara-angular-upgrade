export interface ImageInterface {
    id?: number;
    catalogProductId: number;
    url: string;
    systemColor: string;
    width?: number;
    height?: number;
    dpi?: number;
    format: string;
    grouper: number;
    main: boolean;
    thumbnail: boolean;
    productGtin: string;
}
