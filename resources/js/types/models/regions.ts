import type { Pagination } from "../response";

export interface Provinsi {
    id: number;
    name: string;
}

export interface Kabupaten {
    id: number;
    name: string;
    provinsi_id: number;
    provinsi?: Provinsi;
}

export interface Kecamatan {
    id: number;
    name: string;
    kabupaten_id: number;
    kabupaten?: Kabupaten;
    provinsi_id: number;
    provinsi?: Provinsi;
}

export type ProvinsiPagination = Pagination<Provinsi>
export type KabupatenPagination = Pagination<Kabupaten>
export type KecamatanPagination = Pagination<Kecamatan>
