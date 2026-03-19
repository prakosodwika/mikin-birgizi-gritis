# Project Intelligence — Sistem Transparansi MBG

## Tentang Proyek

**Nama Proyek:** Sistem Transparansi Program Makan Bergizi Gratis (MBG)

**Deskripsi:** Website sistem transparansi program Makan Bergizi Gratis milik pemerintah Indonesia. Tujuan utama adalah membangun kembali kepercayaan masyarakat terhadap program MBG melalui keterbukaan data, standarisasi gizi, dan pengawasan independen.

**Konteks:** MBG adalah program makan siang gratis yang dijalankan oleh Badan Gizi Nasional (BGN) di bawah pemerintahan Presiden Prabowo Subianto, menyasar siswa PAUD hingga SMA/SMK serta ibu hamil dan menyusui.

---

## Masalah yang Diselesaikan

1. Kasus keracunan massal akibat resep dan komposisi makanan yang tidak terstandar
2. Kualitas makanan tidak konsisten antar SPPG (Satuan Pelayanan Pemenuhan Gizi)
3. Distribusi SPPG tidak merata dan tidak transparan
4. Dugaan korupsi dan kurangnya transparansi pengelolaan dana
5. Hilangnya kepercayaan publik terhadap program

---

## User Roles & Permissions

### 1. BGN / Pemerintah Pusat — Admin Level 1
- Menetapkan batas minimum gizi nasional (kalori, protein, lemak, karbohidrat, mikronutrien) per kelompok usia
- **TIDAK membuat resep** — hanya menetapkan standar minimum yang harus dipenuhi SPPG
- Mengelola kebijakan sistem, akun user, dan laporan nasional
- Melihat seluruh data dari semua SPPG

### 2. Operator SPPG — Admin Level 2
- Membuat resep harian, komposisi bahan, dan menghitung nilai gizi
- Sistem otomatis mengecek apakah resep memenuhi standar minimum BGN
  - ✅ Jika lolos: resep aktif dan bisa dijalankan
  - ❌ Jika gagal: SPPG wajib merevisi sebelum menu diaktifkan
- Input laporan operasional: pembelian bahan baku, penggajian, distribusi ke sekolah
- Upload foto menu harian sebagai bukti

### 3. Auditor Independen (Ombudsman / KPK) — Login Khusus
- Akun login khusus dengan akses lebih dari publik biasa
- Dapat mengunduh laporan lengkap dan audit trail
- Dapat menandatangani temuan secara digital (e-signature)
- Dapat men-flag resep, laporan keuangan, atau SPPG yang mencurigakan
- Notifikasi otomatis ke BGN saat ada flag
- Pengaduan masyarakat yang masuk dapat dieskalasi ke auditor

### 4. Publik / Rakyat — Read Only (Tanpa Login)
- Dapat melihat seluruh data secara terbuka tanpa perlu mendaftar
- Dapat mengirimkan pengaduan melalui portal publik

---

## Domain Glossary (Istilah Penting)

| Istilah | Penjelasan |
|---------|-----------|
| **MBG** | Makan Bergizi Gratis — nama program pemerintah |
| **BGN** | Badan Gizi Nasional — lembaga pengelola program MBG |
| **SPPG** | Satuan Pelayanan Pemenuhan Gizi — unit operasional dapur/penyedia makanan |
| **Standar Minimum Gizi** | Batas minimum kalori, protein, lemak, karbohidrat, mikronutrien per kelompok usia yang ditetapkan BGN |
| **Resep** | Menu harian yang dibuat SPPG, harus lolos validasi standar BGN sebelum aktif |
| **Audit Trail** | Riwayat seluruh perubahan data yang bisa diunduh auditor |
| **Flag** | Penandaan mencurigakan oleh auditor pada resep, laporan keuangan, atau SPPG |
| **Kelompok Usia** | PAUD, SD, SMP, SMA/SMK, Ibu Hamil, Ibu Menyusui |

---

## Business Rules (Aturan Bisnis)

- Resep TIDAK boleh diaktifkan sebelum lolos validasi standar minimum gizi BGN
- BGN hanya menetapkan standar — tidak boleh membuat atau mengubah resep SPPG
- Setiap perubahan resep, laporan keuangan, dan data operasional harus tercatat di audit trail
- Auditor dapat men-flag data yang mencurigakan, dan notifikasi otomatis dikirim ke BGN
- Data publik dapat diakses tanpa login — transparansi penuh
- Pengaduan masyarakat bisa dieskalasi ke auditor oleh sistem

---

## Modul Utama Sistem

1. **Manajemen Standar Gizi** — BGN menetapkan standar per kelompok usia
2. **Manajemen Resep** — SPPG membuat resep, sistem validasi otomatis
3. **Manajemen SPPG** — data profil, lokasi, dan status setiap SPPG
4. **Laporan Operasional** — pembelian bahan baku, penggajian, distribusi
5. **Portal Publik** — tampilan data terbuka untuk masyarakat
6. **Pengaduan Masyarakat** — form pengaduan publik + eskalasi ke auditor
7. **Audit & Flagging** — tools auditor untuk flag dan download laporan
8. **Notifikasi** — alert otomatis ke BGN saat ada flag dari auditor

---

## Stack Overview

- **Backend**: Laravel 11 (PHP)
- **Frontend**: React + Inertia.js + TypeScript
- **UI Library**: ShadCN UI + Tailwind CSS v4
- **Icons**: Lucide React
- **Agent**: Gemini CLI

---

## Backend Architecture

### Folder Structure

```
app/
├── Http/
│   ├── Controllers/        # Handle HTTP requests only, delegate to Service
│   └── Requests/           # Form Request validation
├── Models/                 # Eloquent models
├── Repositories/
│   ├── Interfaces/         # Contracts/interfaces for each repository
│   └── {Model}Repository.php
├── Services/               # Business logic layer
└── Providers/
    └── AppServiceProvider.php  # Bind interfaces to implementations
```

### Layer Responsibilities

| Layer | Responsibility | Rule |
|-------|---------------|------|
| **Controller** | Handle HTTP request/response | No business logic, no DB queries |
| **Service** | Business logic | Calls Repository, never touches Model directly |
| **Repository** | Database queries | Only Eloquent/DB calls, no business logic |
| **Model** | Eloquent definition | Fillable, relations, casts only |
| **Request** | Validation | All validation goes here, not in Controller |

### Boilerplate Pattern

#### Model
```php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'stock', 'description'];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];
}
```

#### Repository Interface
```php
// app/Repositories/Interfaces/ProductRepositoryInterface.php
namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface
{
    public function getAll(array $filters = []);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
```

#### Repository Implementation
```php
// app/Repositories/ProductRepository.php
namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;

class ProductRepository implements ProductRepositoryInterface
{
    public function getAll(array $filters = [])
    {
        return Product::query()
            ->when(isset($filters['search']), fn($q) => $q->where('name', 'like', "%{$filters['search']}%"))
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id)
    {
        return Product::findOrFail($id);
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update(int $id, array $data)
    {
        $product = Product::findOrFail($id);
        $product->update($data);
        return $product->fresh();
    }

    public function delete(int $id)
    {
        return Product::destroy($id);
    }
}
```

#### Service
```php
// app/Services/ProductService.php
namespace App\Services;

use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $repository
    ) {}

    public function getAll(array $filters = [])
    {
        return $this->repository->getAll($filters);
    }

    public function findById(int $id)
    {
        return $this->repository->findById($id);
    }

    public function create(array $data)
    {
        return DB::transaction(fn() => $this->repository->create($data));
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(fn() => $this->repository->update($id, $data));
    }

    public function delete(int $id)
    {
        return DB::transaction(fn() => $this->repository->delete($id));
    }
}
```

#### Controller
```php
// app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(protected ProductService $service) {}

    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => $this->service->getAll(request()->all()),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $this->service->create($request->validated());
        return back()->with('success', 'Product created successfully.');
    }

    public function update(UpdateProductRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return back()->with('success', 'Product deleted successfully.');
    }
}
```

#### Bind in AppServiceProvider
```php
// app/Providers/AppServiceProvider.php
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\ProductRepository;

public function register(): void
{
    $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
}
```

---

## Frontend Architecture (React + Inertia + ShadCN)

### Folder Structure

```
resources/js/
├── Components/
│   ├── ui/                 # ShadCN auto-generated components (DO NOT edit)
│   └── shared/             # Reusable custom components
├── Pages/
│   └── {Module}/
│       ├── Index.tsx       # List page
│       ├── Create.tsx      # Create form page
│       └── Edit.tsx        # Edit form page
├── Layouts/
│   └── AppLayout.tsx
├── hooks/                  # Custom React hooks
├── lib/
│   └── utils.ts            # cn() and helpers
└── types/
    └── index.d.ts          # Global TypeScript types
```

### ShadCN UI Rules (ALWAYS FOLLOW)

#### Styling
- Use `cn()` for conditional classes — never string template literals
- Use `gap-*` for spacing — **never** `space-x-*` or `space-y-*`
- Use `size-*` when width = height (e.g. `size-10` not `w-10 h-10`)
- Use semantic colors: `bg-primary`, `text-muted-foreground` — **never** raw colors like `bg-blue-500`
- No manual `dark:` overrides — use semantic tokens
- No manual `z-index` on overlays (Dialog, Sheet, Popover handle their own)

#### Forms
- Forms use `FieldGroup` + `Field` — never raw `div` with `space-y-*`
- Field validation: `data-invalid` on `Field`, `aria-invalid` on the control
- Option sets (2–7 choices): use `ToggleGroup`, not looped `Button`

#### Components
- **Dialog/Sheet/Drawer**: always include `Title` (use `className="sr-only"` if visually hidden)
- **Card**: always use full composition `CardHeader/CardTitle/CardContent/CardFooter`
- **Button loading state**: compose with `Spinner` + `disabled`, no `isLoading` prop
- **Toast**: use `sonner` — `toast()` from `sonner`
- **Empty states**: use `Empty` component
- **Loading placeholders**: use `Skeleton`, never custom `animate-pulse`
- **Dividers**: use `Separator`, never `<hr>` or `border-t` div

#### Icons
- Icons in Button: use `data-icon="inline-start"` or `data-icon="inline-end"`
- No sizing classes on icons inside components (no `size-4` or `w-4 h-4`)
- Import from `lucide-react`

#### Component Selection Guide

| Need | Use |
|------|-----|
| Data table | `Table` + `TableHeader/Body/Row/Cell` |
| Modal/confirmation | `Dialog` or `AlertDialog` |
| Side panel | `Sheet` |
| Bottom sheet | `Drawer` |
| Notifications | `sonner` toast |
| Dropdown actions | `DropdownMenu` |
| Form inputs | `Input`, `Select`, `Textarea`, `Checkbox`, `Switch` |
| Navigation | `Sidebar`, `Breadcrumb`, `Tabs` |
| Status indicators | `Badge` (never custom styled spans) |
| Loading | `Skeleton` |
| Alerts/callouts | `Alert` (never custom div) |

### Page Component Pattern

```tsx
// resources/js/Pages/Products/Index.tsx
import { Head } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface Props {
  products: {
    data: Product[]
    current_page: number
    last_page: number
  }
}

export default function ProductIndex({ products }: Props) {
  const handleDelete = (id: number) => {
    router.delete(route('products.destroy', id), {
      onBefore: () => confirm('Are you sure?'),
    })
  }

  return (
    <AppLayout>
      <Head title="Products" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Products</h1>
          <Button href={route('products.create')}>
            <Plus data-icon="inline-start" />
            Add Product
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.visit(route('products.edit', product.id))}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  )
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Controller | PascalCase + Controller | `ProductController` |
| Service | PascalCase + Service | `ProductService` |
| Repository | PascalCase + Repository | `ProductRepository` |
| Interface | PascalCase + RepositoryInterface | `ProductRepositoryInterface` |
| Model | PascalCase singular | `Product` |
| Migration | snake_case plural | `create_products_table` |
| React Page | PascalCase | `ProductIndex.tsx` |
| React Component | PascalCase | `ProductForm.tsx` |
| Route name | snake_case with dot | `products.index` |

---

## API Response Format

Always return consistent JSON responses:

```php
// Success
return response()->json([
    'success' => true,
    'message' => 'Product created successfully.',
    'data'    => $product,
], 201);

// Error
return response()->json([
    'success' => false,
    'message' => 'Product not found.',
    'errors'  => [],
], 404);
```

---

## Code Generation Rules for Gemini

When asked to create a new module (e.g. "create CRUD for Order"):

1. **Always generate in this order**:
   - Migration
   - Model
   - Repository Interface (`app/Repositories/Interfaces/`)
   - Repository (`app/Repositories/`)
   - Service (`app/Services/`)
   - Form Requests (`app/Http/Requests/`)
   - Controller (`app/Http/Controllers/`)
   - Routes (`routes/web.php`)
   - React Pages (`resources/js/Pages/{Module}/`)

2. **Always bind** the new Interface → Implementation in `AppServiceProvider`

3. **Frontend always uses ShadCN components** — never raw HTML elements for UI

4. **Never put business logic in Controller** — always delegate to Service

5. **Never query DB in Controller or Service** — only in Repository

6. **Always use TypeScript** for React components

7. **Always use Inertia.js** for page rendering — never build separate API endpoints for page data

---

## Security Rules

- Always use `$request->validated()` — never `$request->all()` directly in create/update
- Always use Laravel's mass assignment protection (`$fillable`)
- Use `DB::transaction()` for operations that modify multiple tables
- Validate all input in Form Request classes
- Use Laravel's built-in CSRF protection (Inertia handles this automatically)
- Never expose sensitive model attributes — use `$hidden` on Model
