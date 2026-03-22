// resources/js/pages/Kabupaten/Form.tsx
import InputError from '@/components/input-error'
import { FieldGroup, Field } from '@/components/ui/field-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Provinsi } from '@/types/models/regions'

interface Props {
    data: {
        name: string
        provinsi_id: string | number
    }
    setData: (key: string, value: any) => void
    errors?: { [key: string]: string }
    provinsis: Provinsi[]
}

export default function KabupatenForm({ data, setData, errors, provinsis }: Props) {
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
            <Field data-invalid={!!errors?.provinsi_id}>
                <Label htmlFor="provinsi_id">Provinsi</Label>
                <Select
                    name="provinsi_id"
                    value={String(data.provinsi_id)}
                    onValueChange={(value) => setData('provinsi_id', value)}
                >
                    <SelectTrigger aria-invalid={!!errors?.provinsi_id}>
                        <SelectValue placeholder="Select a provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinsis.map((provinsi) => (
                            <SelectItem key={provinsi.id} value={String(provinsi.id)}>{provinsi.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors?.provinsi_id} />
            </Field>
        </FieldGroup>
    )
}
