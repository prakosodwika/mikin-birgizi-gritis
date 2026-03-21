// resources/js/pages/Sekolah/Form.tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldGroup, Field } from '@/components/ui/field-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import InputError from '@/components/input-error'

interface Kecamatan {
    id: number
    name: string
}

interface Sppg {
    id: number
    name: string
}

interface Props {
    data: {
        name: string
        address: string
        level: string
        total_students: string | number
        kecamatan_id: string | number
        satuan_pelayanan_pemenuhan_gizi_id: string | number | null
    }
    setData: (key: string, value: any) => void
    errors?: { [key: string]: string }
    kecamatans: Kecamatan[]
    sppgs: Sppg[]
}

const levels = ['PAUD', 'SD', 'SMP', 'SMA', 'SMK']

export default function SekolahForm({ data, setData, errors, kecamatans, sppgs }: Props) {
    return (
        <FieldGroup>
            <Field data-invalid={!!errors?.name}>
                <Label htmlFor="name">Nama Sekolah</Label>
                <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama sekolah"
                    aria-invalid={!!errors?.name}
                />
                <InputError message={errors?.name} />
            </Field>

            <Field data-invalid={!!errors?.address}>
                <Label htmlFor="address">Alamat</Label>
                <Input
                    id="address"
                    name="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Masukkan alamat sekolah"
                    aria-invalid={!!errors?.address}
                />
                <InputError message={errors?.address} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field data-invalid={!!errors?.level}>
                    <Label htmlFor="level">Tingkat Sekolah</Label>
                    <Select
                        name="level"
                        value={data.level}
                        onValueChange={(value) => setData('level', value)}
                    >
                        <SelectTrigger aria-invalid={!!errors?.level}>
                            <SelectValue placeholder="Pilih tingkat" />
                        </SelectTrigger>
                        <SelectContent>
                            {levels.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors?.level} />
                </Field>

                <Field data-invalid={!!errors?.total_students}>
                    <Label htmlFor="total_students">Jumlah Siswa</Label>
                    <Input
                        id="total_students"
                        name="total_students"
                        type="number"
                        value={data.total_students}
                        onChange={(e) => setData('total_students', e.target.value)}
                        placeholder="0"
                        aria-invalid={!!errors?.total_students}
                    />
                    <InputError message={errors?.total_students} />
                </Field>
            </div>

            <Field data-invalid={!!errors?.kecamatan_id}>
                <Label htmlFor="kecamatan_id">Kecamatan</Label>
                <Select
                    name="kecamatan_id"
                    value={String(data.kecamatan_id)}
                    onValueChange={(value) => setData('kecamatan_id', value)}
                >
                    <SelectTrigger aria-invalid={!!errors?.kecamatan_id}>
                        <SelectValue placeholder="Pilih kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                        {kecamatans.map((kecamatan) => (
                            <SelectItem key={kecamatan.id} value={String(kecamatan.id)}>{kecamatan.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors?.kecamatan_id} />
            </Field>

            <Field data-invalid={!!errors?.satuan_pelayanan_pemenuhan_gizi_id}>
                <Label htmlFor="satuan_pelayanan_pemenuhan_gizi_id">Satuan Pelayanan (SPPG)</Label>
                <Select
                    name="satuan_pelayanan_pemenuhan_gizi_id"
                    value={data.satuan_pelayanan_pemenuhan_gizi_id ? String(data.satuan_pelayanan_pemenuhan_gizi_id) : "null"}
                    onValueChange={(value) => setData('satuan_pelayanan_pemenuhan_gizi_id', value === "null" ? null : value)}
                >
                    <SelectTrigger aria-invalid={!!errors?.satuan_pelayanan_pemenuhan_gizi_id}>
                        <SelectValue placeholder="Pilih SPPG (Opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="null">Belum dikaitkan</SelectItem>
                        {sppgs.map((sppg) => (
                            <SelectItem key={sppg.id} value={String(sppg.id)}>{sppg.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors?.satuan_pelayanan_pemenuhan_gizi_id} />
            </Field>
        </FieldGroup>
    )
}
