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

export interface ProgramGiziBahan {
    id: number;
    program_gizi_id: number;
    nama_bahan: string;
    satuan: string;
    jumlah: number;
    kalori_per_100g: number;
    protein_per_100g: number;
    lemak_per_100g: number;
    karbohidrat_per_100g: number;
    harga_per_satuan: number;
    created_at: string;
    updated_at: string;
}

export interface ProgramGizi {
    id: number;
    satuan_pelayanan_pemenuhan_gizi_id: number;
    tanggal: string;
    nama_program: string;
    kelompok_usia: 'PAUD' | 'SD' | 'SMP' | 'SMA' | 'Ibu Hamil' | 'Ibu Menyusui';
    catatan: string | null;
    jumlah_porsi: number;
    status_validasi: 'pending' | 'valid' | 'invalid';
    kalori_total: number;
    protein_total: number;
    lemak_total: number;
    karbohidrat_total: number;
    harga_per_porsi: number;
    created_at: string;
    updated_at: string;
    bahans?: ProgramGiziBahan[];
}
