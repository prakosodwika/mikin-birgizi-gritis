// resources/js/pages/Kecamatan/Form.tsx
import InputError from '@/components/input-error'
import { FieldGroup, Field } from '@/components/ui/field-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Kabupaten, Provinsi } from '@/types/models/regions'

interface Props {
    data: {
        name: string
        kabupaten_id: string | number
        provinsi_id: string | number
    }
    setData: (key: string, value: any) => void
    errors?: { [key: string]: string }
    kabupatens: Kabupaten[]
    provinsis: Provinsi[]
}

export default function KecamatanForm({ data, setData, errors, kabupatens, provinsis }: Props) {
    return (
        <FieldGroup>
            <Field data-invalid={!!errors?.name}>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    aria-invalid={!!errors?.name}
                />
                <InputError message={errors?.name} />
            </Field>
            <div className='flex gap-4'>
                <Field data-invalid={!!errors?.kabupaten_id}>
                    <Label htmlFor="kabupaten_id">Kabupaten</Label>
                    <Select
                        name="kabupaten_id"
                        value={String(data.kabupaten_id)}
                        onValueChange={(value) => setData('kabupaten_id', value)}
                    >
                        <SelectTrigger aria-invalid={!!errors?.kabupaten_id}>
                            <SelectValue placeholder="Select a kabupaten" />
                        </SelectTrigger>
                        <SelectContent>
                            {kabupatens.map((kabupaten) => (
                                <SelectItem key={kabupaten.id} value={String(kabupaten.id)}>{kabupaten.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors?.provinsi_id} />
                </Field>
                <Field data-invalid={!!errors?.provinsi_id}>
                    <Label htmlFor="provinsi_id">Kabupaten</Label>
                    <Select
                        name="provinsi_id"
                        value={String(data.provinsi_id)}
                        onValueChange={(value) => setData('provinsi_id', value)}
                    >
                        <SelectTrigger aria-invalid={!!errors?.provinsi_id}>
                            <SelectValue placeholder="Select a kabupaten" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinsis.map((provinsi) => (
                                <SelectItem key={provinsi.id} value={String(provinsi.id)}>{provinsi.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors?.provinsi_id} />
                </Field>
            </div>
        </FieldGroup>
    )
}
