export interface Provinsi {
    id: number;
    name: string;
}

export interface Kabupaten {
    id: number;
    provinsi_id: number;
    name: string;
    provinsi?: Provinsi;
}

export interface Kecamatan {
    id: number;
    kabupaten_id: number;
    name: string;
    kabupaten?: Kabupaten;
}

export interface SatuanPelayananPemenuhanGizi {
    id: number;
    name: string;
    address: string;
    provinsi_id: number | null;
    kabupaten_id: number | null;
    kecamatan_id: number | null;
    contact_number: string | null;
    status: 'active' | 'inactive';
    flagged_at: string | null;
    flag_note: string | null;
    created_at: string;
    updated_at: string;
    provinsi?: Provinsi;
    kabupaten?: Kabupaten;
    kecamatan?: Kecamatan;
}

export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: 'badan_gizi_nasional' | 'operator_satuan_pelayanan_pemenuhan_gizi' | 'auditor_independen';
    satuan_pelayanan_pemenuhan_gizi_id: number | null;
    status: 'active' | 'inactive';
    last_login_at: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    satuan_pelayanan_pemenuhan_gizi?: SatuanPelayananPemenuhanGizi;
}

export interface StandarGizi {
    id: number;
    kelompok_usia: string;
    kalori: number;
    protein: number;
    lemak: number;
    karbohidrat: number;
    created_at: string;
    updated_at: string;
}

export interface StandarGiziHistory {
    id: number;
    standar_gizi_id: number;
    user_id: number;
    old_values: {
        kalori: number;
        protein: number;
        lemak: number;
        karbohidrat: number;
    } | null;
    new_values: {
        kalori: number;
        protein: number;
        lemak: number;
        karbohidrat: number;
    };
    reason: string | null;
    created_at: string;
    user?: AppUser;
}
