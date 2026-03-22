import type { Pagination } from "../response";
import type { Kabupaten, Kecamatan, Provinsi } from "./regions";

export enum Status {
    Active = "active",
    Inactive = "inactive",
}

export interface SatuanPelayananPemenuhanGizi {
    id: number;
    name: string;
    address: string;
    provinsi_id: number | null;
    kabupaten_id: number | null;
    kecamatan_id: number | null;
    contact_number: string | null;
    status: Status;
    flagged_at: string | null;
    flag_note: string | null;
    created_at: string;
    updated_at: string;
    provinsi?: Provinsi;
    kabupaten?: Kabupaten;
    kecamatan?: Kecamatan;
}

export type SatuanPelayananPemenuhanGiziPagination = Pagination<SatuanPelayananPemenuhanGizi>;
