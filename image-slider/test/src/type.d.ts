export interface option {
    sliderWindowId: string;
    sliderDomId?: string;
    sliderListName?: string;
    direction?: string;
    intervals?: number;
    step?: number;
    distance?: string | number;
    time?: number;
    item?: boolean;
    switch?: boolean;
    auto?: boolean;
    hover?: boolean;
    switchType?: string;
    customizeSwitch?: boolean;
    switchCallback?: (type: any, distance: any, clickDom: HTMLElement, showDom: HTMLElement) => void;
}
