// resources/js/pages/Provinsi/Form.tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldGroup, Field } from '@/components/ui/field-group'
import InputError from '@/components/input-error'

interface Props {
  data: {
    name: string
  }
  setData: (key: string, value: any) => void
  errors?: { [key: string]: string }
}

export default function ProvinsiForm({ data, setData, errors }: Props) {
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
    </FieldGroup>
  )
}
