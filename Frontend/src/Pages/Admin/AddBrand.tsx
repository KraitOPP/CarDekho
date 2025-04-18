import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, X, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/slices/brandApiSlice";

const brandSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface Brand {
  id: number;
  brand_name: string;
  brand_logo: string;
}

const BrandManagement: React.FC = () => {
  const { data: fetchedInfo, isLoading: isLoadingBrands, refetch } = useGetBrandsQuery({});
  const fetchedBrands: Brand[] = fetchedInfo?.brands || [];
  const [addBrand, { isLoading: isAdding }] = useAddBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { brand_name: "" },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { brand_name: "" },
  });

  useEffect(() => {
    if (fetchedBrands) {
      setBrands(fetchedBrands);
    }
  }, [fetchedBrands]);

  const onAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAddPreview(previewUrl);
      toast("File selected", { description: file.name });
    }
  };

  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEditPreview(previewUrl);
      toast("File selected", { description: file.name });
    }
  };

  async function onAddBrandSubmit(data: BrandFormValues) {
    try {
      const formData = new FormData();
      formData.append("brand_name", data.brand_name);
      if (addFile) {
        formData.append("brand_logo", addFile);
      }

      await addBrand(formData).unwrap();
      toast.success("Brand added successfully");
      await refetch();
      resetAdd();
      setAddFile(null);
      setAddPreview(null);
      if (addFileInputRef.current) {
        addFileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Add Brand error:", error);
      toast.error(error?.data?.error || "Failed to add brand");
    }
  }

  async function onEditBrandSubmit(data: BrandFormValues) {
    if (!editingBrand) return;
    try {
      const formData = new FormData();
      formData.append("brand_name", data.brand_name);
      if (editFile) {
        formData.append("brand_logo", editFile);
      }
      
      for (const [key, value] of formData.entries()) {
        console.log(`Edit FormData: ${key}:`, value);
      }

      await updateBrand({ id: editingBrand.id, payload: formData }).unwrap();
      toast.success("Brand updated successfully");
      await refetch();
      setEditingBrand(null);
      resetEdit();
      setEditFile(null);
      setEditPreview(null);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Update Brand error:", error);
      toast.error(error?.data?.error || "Failed to update brand");
    }
  }

  async function onDeleteBrand(id: number) {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteBrand({ _id: id }).unwrap();
      toast.success("Brand deleted successfully");
      await refetch();
    } catch (error: any) {
      console.error("Delete Brand error:", error);
      toast.error(error?.data?.error || "Failed to delete brand");
    }
  }

  function openEditDialog(brand: Brand) {
    setEditingBrand(brand);
    resetEdit({ brand_name: brand.brand_name });
    setEditPreview(brand.brand_logo);
    setEditFile(null);
  }

  useEffect(() => {
    return () => {
      if (addPreview && addPreview.startsWith("blob:")) {
        URL.revokeObjectURL(addPreview);
      }
      if (editPreview && editPreview.startsWith("blob:")) {
        URL.revokeObjectURL(editPreview);
      }
    };
  }, [addPreview, editPreview]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vehicle Brand Management</h1>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Add Brand Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitAdd(onAddBrandSubmit)} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="brand_name">Brand Name</Label>
              <Input id="brand_name" placeholder="Enter brand name" {...registerAdd("brand_name")} />
              {addErrors.brand_name && <p className="text-red-500 text-xs">{addErrors.brand_name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Brand Logo</Label>
              <input
                type="file"
                accept="image/*"
                onChange={onAddFileChange}
                ref={addFileInputRef}
                className="hidden"
              />
              <div className="flex items-center">
                <Button variant="outline" onClick={() => addFileInputRef.current?.click()} type="button">
                  <Upload className="mr-2 w-4 h-4" /> Upload Logo
                </Button>
                {addPreview && (
                  <div className="ml-4 relative w-10 h-10">
                    <img src={addPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => {
                        setAddPreview(null);
                        setAddFile(null);
                        if (addFileInputRef.current) addFileInputRef.current.value = "";
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isAdding} className="max-w-50">
              {isAdding ? "Adding..." : "Add Brand"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Brands */}
      {isLoadingBrands ? (
        <div className="text-center py-10">Loading brands...</div>
      ) : brands.length === 0 ? (
        <div className="text-center py-10">No brands found. Add your first brand above.</div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {brands.map((brand) => (
            <Card key={brand.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {brand.brand_logo ? (
                    <img src={brand.brand_logo} alt={`${brand.brand_name} logo`} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                      <span className="text-gray-400">No logo</span>
                    </div>
                  )}
                  <span className="font-semibold">{brand.brand_name}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(brand)} title="Edit brand">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteBrand(brand.id)}
                    disabled={isDeleting}
                    title="Delete brand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Brand Dialog */}
      <Dialog open={!!editingBrand} onOpenChange={(open) => !open && setEditingBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update brand information and click save when done.</DialogDescription>
          </DialogHeader>
          {editingBrand && (
            <form onSubmit={handleSubmitEdit(onEditBrandSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_brand_name">Brand Name</Label>
                <Input
                  id="edit_brand_name"
                  placeholder="Enter brand name"
                  {...registerEdit("brand_name")}
                />
                {editErrors.brand_name && <p className="text-red-500 text-xs">{editErrors.brand_name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Brand Logo</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onEditFileChange}
                  ref={editFileInputRef}
                  className="hidden"
                />
                <div className="flex items-center">
                  <Button variant="outline" onClick={() => editFileInputRef.current?.click()} type="button">
                    <Upload className="mr-2 w-4 h-4" /> Upload Logo
                  </Button>
                  {editPreview && (
                    <div className="ml-4 relative w-10 h-10">
                      <img src={editPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => {
                          setEditPreview(null);
                          setEditFile(null);
                          if (editFileInputRef.current) editFileInputRef.current.value = "";
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setEditingBrand(null)}>
                  <X className="mr-2 w-4 h-4" /> Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="max-w-30">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandManagement;
