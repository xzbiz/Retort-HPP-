"use client"

import { useState } from "react"
import Image from "next/image"<Image src="/R2B2.png" alt="Logo" width={60} height={60} className="mr-4" />

import { Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Define types for our data structures
type Item = {
  nama: string
  berat: string
  satuan: string
  harga: string
}

type JasaRetort = {
  [key: string]: {
    harga: number
    max: number
  }
}

type HasilPerhitungan = {
  totalBahan: number
  tenaga: number
  kirim: number
  biayaProduksi: number
  biayaRetort: number
  total: number
  hpp: number
  jual: number
  pcs: number
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([{ nama: "", berat: "", satuan: "gram", harga: "" }])
  const [tenagaKerja, setTenagaKerja] = useState<string>("")
  const [pengiriman, setPengiriman] = useState<string>("")
  const [beratKirim, setBeratKirim] = useState<string>("")
  const [kemasan, setKemasan] = useState<string>("100g")

  const jasaRetort: JasaRetort = {
    "100g": { harga: 5100, max: 75 },
    "250g": { harga: 8000, max: 45 },
    "500g": { harga: 11500, max: 20 },
  }

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { nama: "", berat: "", satuan: "gram", harga: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  const hitung = (): HasilPerhitungan => {
    const totalBahan = items.reduce((sum, item) => sum + Number.parseFloat(item.harga || "0"), 0)
    const tenaga = Number.parseFloat(tenagaKerja || "0")
    let kirim = Number.parseFloat(pengiriman || "0")
    const berat = Number.parseFloat(beratKirim || "0")

    if (berat >= 2) kirim *= 0.8 // diskon 20%

    const jasa = jasaRetort[kemasan]
    const biayaRetort = jasa.harga * jasa.max

    const biayaProduksi = totalBahan + tenaga + kirim
    const total = biayaProduksi + biayaRetort
    const hpp = total / jasa.max
    const jual = hpp * 1.25

    return {
      totalBahan,
      tenaga,
      kirim,
      biayaProduksi,
      biayaRetort,
      total,
      hpp,
      jual,
      pcs: jasa.max,
    }
  }

  const hasil = hitung()

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 p-4 md:p-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <Image
                src="/R2B2.png"
                alt="Logo PT Rumah Retort Bersama"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-sky-800">Retort HPP Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-sky-700">Bahan Baku</h2>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-12 sm:col-span-4">
                      <Label htmlFor={`nama-${i}`} className="sr-only">
                        Nama Bahan
                      </Label>
                      <Input
                        id={`nama-${i}`}
                        placeholder="Nama Bahan"
                        value={item.nama}
                        onChange={(e) => handleItemChange(i, "nama", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Label htmlFor={`berat-${i}`} className="sr-only">
                        Berat
                      </Label>
                      <Input
                        id={`berat-${i}`}
                        placeholder="Berat"
                        value={item.berat}
                        onChange={(e) => handleItemChange(i, "berat", e.target.value)}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Label htmlFor={`satuan-${i}`} className="sr-only">
                        Satuan
                      </Label>
                      <Select value={item.satuan} onValueChange={(value) => handleItemChange(i, "satuan", value)}>
                        <SelectTrigger id={`satuan-${i}`}>
                          <SelectValue placeholder="Satuan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gram">gram</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="liter">liter</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                      <Label htmlFor={`harga-${i}`} className="sr-only">
                        Harga (Rp)
                      </Label>
                      <Input
                        id={`harga-${i}`}
                        placeholder="Harga (Rp)"
                        value={item.harga}
                        onChange={(e) => handleItemChange(i, "harga", e.target.value)}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(i)}
                        disabled={items.length <= 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Hapus bahan</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addItem} className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Bahan
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-3 text-sky-700">Biaya Tambahan</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="tenaga-kerja">Biaya Tenaga Kerja (Rp)</Label>
                  <Input
                    id="tenaga-kerja"
                    placeholder="Biaya Tenaga Kerja (Rp)"
                    value={tenagaKerja}
                    onChange={(e) => setTenagaKerja(e.target.value)}
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="pengiriman">Biaya Pengiriman (Rp)</Label>
                  <Input
                    id="pengiriman"
                    placeholder="Biaya Pengiriman (Rp)"
                    value={pengiriman}
                    onChange={(e) => setPengiriman(e.target.value)}
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="berat-kirim">Berat Kirim (kg)</Label>
                  <Input
                    id="berat-kirim"
                    placeholder="Berat Kirim (kg)"
                    value={beratKirim}
                    onChange={(e) => setBeratKirim(e.target.value)}
                    type="number"
                    min="0"
                    step="0.1"
                  />
                  {Number.parseFloat(beratKirim || "0") >= 2 && (
                    <p className="text-sm text-green-600 mt-1">Diskon pengiriman 20% diterapkan</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="kemasan">Ukuran Kemasan</Label>
                  <Select value={kemasan} onValueChange={setKemasan}>
                    <SelectTrigger id="kemasan">
                      <SelectValue placeholder="Pilih ukuran kemasan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100g">Kemasan 100g (75 pcs)</SelectItem>
                      <SelectItem value="250g">Kemasan 250g (45 pcs)</SelectItem>
                      <SelectItem value="500g">Kemasan 500g (20 pcs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-sky-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-sky-800">Hasil Perhitungan</h2>
              <div className="space-y-2 text-sm md:text-base">
                <div className="grid grid-cols-2">
                  <p>Total Biaya Bahan Baku:</p>
                  <p className="font-medium text-right">Rp {hasil.totalBahan.toLocaleString("id-ID")}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Biaya Tenaga Kerja:</p>
                  <p className="font-medium text-right">Rp {hasil.tenaga.toLocaleString("id-ID")}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Biaya Pengiriman:</p>
                  <p className="font-medium text-right">Rp {hasil.kirim.toLocaleString("id-ID")}</p>
                </div>
                <div className="grid grid-cols-2 font-semibold">
                  <p>Total Biaya Produksi:</p>
                  <p className="text-right">Rp {hasil.biayaProduksi.toLocaleString("id-ID")}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Biaya Jasa Retort:</p>
                  <p className="font-medium text-right">Rp {hasil.biayaRetort.toLocaleString("id-ID")}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 font-semibold">
                  <p>Total Biaya Keseluruhan:</p>
                  <p className="text-right">Rp {hasil.total.toLocaleString("id-ID")}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Jumlah Produk:</p>
                  <p className="font-medium text-right">{hasil.pcs} pcs</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>HPP per pcs:</p>
                  <p className="font-medium text-right">Rp {Math.round(hasil.hpp).toLocaleString("id-ID")}</p>
                </div>
                <div className="grid grid-cols-2 bg-sky-100 p-2 rounded font-bold text-sky-900">
                  <p>Harga Jual per pcs (25% margin):</p>
                  <p className="text-right">Rp {Math.round(hasil.jual).toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-sky-800 mt-8 mb-4">
        <p className="mb-1">
          Kontak:{" "}
          <a
            href="https://wa.me/6282134320434"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            WhatsApp 0821-3432-0434
          </a>
        </p>
        <p>&copy; 2025 PT Rumah Retort Bersama</p>
      </footer>
    </div>
  )
}
