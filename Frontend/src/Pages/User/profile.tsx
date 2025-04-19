import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { Loader2, User, MapPin, FileText, Lock, Upload, CreditCard, Shield, Eye } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetProfileInfoQuery, 
  useUpdateProfileMutation,
  useUpdatePasswordMutation 
} from "@/slices/authApiSlice";

export default function ProfilePage(){
    const { data: userInfo, isLoading, isError } = useGetProfileInfoQuery({});
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [dlDocument, setDlDocument] = useState(null);
    const [aadhaarDocument, setAadhaarDocument] = useState(null);
    const [previewDl, setPreviewDl] = useState(null);
    const [previewAadhaar, setPreviewAadhaar] = useState(null);
    
    const user = userInfo?.userInfo;
    const profileForm = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone_number: "",
            license_number: "",
            address: {
                house_no: "",
                street: "",
                area: "",
                city: "",
                state: "",
                zip_code: "",
                country: "",
            },
        },
    });

    const passwordForm = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const formInitialized = useRef(false);
    
    useEffect(() => {
        if (user && Object.keys(user).length > 0 && !formInitialized.current) {
            profileForm.reset({
                name: user.name || "",
                email: user.email || "",
                phone_number: user.phoneNumber || user.phone_number || "",
                license_number: user.licenseNumber || user.license_number || "",
                address: {
                    house_no: user.address?.houseNumber || user.house_no || "",
                    street: user.address?.street || user.street || "",
                    area: user.address?.area || user.area || "",
                    city: user.address?.city || user.city || "",
                    state: user.address?.state || user.state || "",
                    zip_code: user.address?.zipCode || user.zip_code || "",
                    country: user.address?.country || user.country || "",
                },
            });
            
            // Set document preview URLs if available
            if (user.licenseImageUrl) {
                setPreviewDl(user.licenseImageUrl);
            }
            
            if (user.aadhaarImageUrl) {
                setPreviewAadhaar(user.aadhaarImageUrl);
            }
            
            formInitialized.current = true;
        }
    }, [user, profileForm]);

    async function onProfileSubmit(data) {
        try {
            const formData = new FormData();
            
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phone_number);
            formData.append("licenseNumber", data.license_number);
            
            formData.append("houseNumber", data.address.house_no);
            formData.append("street", data.address.street);
            formData.append("area", data.address.area);
            formData.append("city", data.address.city);
            formData.append("state", data.address.state);
            formData.append("zipCode", data.address.zip_code);
            formData.append("country", data.address.country);
            
            if (dlDocument) {
                formData.append("license_image", dlDocument);
            }
            
            if (aadhaarDocument) {
                formData.append("aadhaar_image", aadhaarDocument);
            }

            const result = await updateProfile(formData).unwrap();
            
            toast.success("Profile Updated Successfully", { 
                description: result.message || "Your profile has been updated."
            });
            
            // Update previews with new URLs if available in response
            if (result.userInfo?.licenseImageUrl) {
                setPreviewDl(result.userInfo.licenseImageUrl);
            }
            
            if (result.userInfo?.aadhaarImageUrl) {
                setPreviewAadhaar(result.userInfo.aadhaarImageUrl);
            }
            
            setIsEditing(false);
        } catch (err) {
            toast.error("Update Failed", { 
                description: err.data?.error || "An error occurred while updating your profile."
            });
        }
    }

    async function onPasswordSubmit(data) {
        try {
            if (data.newPassword !== data.confirmNewPassword) {
                toast.warning("Passwords do not match", {
                    description: "Please ensure the new passwords are identical."
                });
                return;
            }

            const passwordData = {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            };

            const result = await updatePassword(passwordData).unwrap();
            
            toast.success("Password Updated Successfully", { 
                description: result.message || "Your password has been updated."
            });
            
            passwordForm.reset({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
            
            setIsEditing(false);
        } catch (err) {
            toast.error("Password Update Failed", { 
                description: err.data?.error || "An error occurred while updating your password."
            });
        }
    }

    const handleDLDocumentChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setDlDocument(file);
            
            // Create preview URL for the uploaded file
            const objUrl = URL.createObjectURL(file);
            setPreviewDl(objUrl);
            
            toast("Driving License Document Selected", { description: file.name });
        }
    };

    const handleAadhaarDocumentChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAadhaarDocument(file);
            
            // Create preview URL for the uploaded file
            const objUrl = URL.createObjectURL(file);
            setPreviewAadhaar(objUrl);
            
            toast("Aadhaar Document Selected", { description: file.name });
        }
    };

    // Function to determine if file is an image by extension
    const isImageFile = (url) => {
        if (!url) return false;
        const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return extensions.some(ext => url.toLowerCase().includes(ext));
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (previewDl && previewDl.startsWith('blob:')) {
                URL.revokeObjectURL(previewDl);
            }
            if (previewAadhaar && previewAadhaar.startsWith('blob:')) {
                URL.revokeObjectURL(previewAadhaar);
            }
        };
    }, []);

    if(isLoading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
            </div>
        );
    }

    if(isError){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Failed to load profile information.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "destructive" : "outline"}
                        disabled={isUpdating || isUpdatingPassword}
                    >
                        {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                </div>

                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="personal" className="space-x-2">
                            <User size={16} />
                            <span>Personal Info</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="space-x-2">
                            <Shield size={16} />
                            <span>Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="space-x-2">
                            <FileText size={16} />
                            <span>Documents</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information and Address */}
                    <TabsContent value="personal">
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <User size={20} />
                                            <span>Personal Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={profileForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="email" disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="phone_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="tel" disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <MapPin size={20} />
                                            <span>Address Details</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={profileForm.control}
                                            name="address.house_no"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>House Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="address.street"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Street</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="address.area"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Area</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="address.city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="address.state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="address.zip_code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Zip Code</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="address.country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {isEditing && (
                                    <Button type="submit" className="w-full" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>

                    {/* Security Tab - Separate Password Update Form */}
                    <TabsContent value="security">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lock size={20} />
                                            <span>Password Management</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={passwordForm.control}
                                            name="oldPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={!isEditing || isUpdatingPassword} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div></div> {/* Empty div for grid alignment */}
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={!isEditing || isUpdatingPassword} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmNewPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={!isEditing || isUpdatingPassword} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Security Tips Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Shield size={20} />
                                            <span>Security Recommendations</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start">
                                                <span className="mr-2 text-green-600">•</span>
                                                <span>Use a strong password with at least 8 characters including numbers, uppercase, lowercase, and special characters</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mr-2 text-green-600">•</span>
                                                <span>Never share your password or security codes with anyone</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mr-2 text-green-600">•</span>
                                                <span>Update your password regularly (every 3-6 months)</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {isEditing && (
                                    <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
                                        {isUpdatingPassword ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating Password...
                                            </>
                                        ) : (
                                            "Update Password"
                                        )}
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>

                    {/* Documents Tab for Driving License and Aadhaar */}
                    <TabsContent value="documents">
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6" encType="multipart/form-data">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <FileText size={20} />
                                            <span>Driving License</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={profileForm.control}
                                            name="license_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>License Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormItem>
                                            <FormLabel>Upload Driving License</FormLabel>
                                            <FormControl>
                                                <div className={`border rounded-md border-input p-2 ${!isEditing ? 'bg-gray-100' : ''}`}>
                                                    <div className="flex items-center justify-center flex-col p-4">
                                                        {previewDl ? (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isImageFile(previewDl) ? (
                                                                    <div className="relative mb-4 w-full max-w-xs">
                                                                        <img 
                                                                            src={previewDl} 
                                                                            alt="Driving License Preview" 
                                                                            className="max-h-40 object-contain rounded-md border border-gray-200 w-full"
                                                                        />
                                                                        {isEditing && (
                                                                            <div className="absolute top-2 right-2">
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    className="w-8 h-8 rounded-full p-0"
                                                                                    type="button"
                                                                                    onClick={() => window.open(previewDl, '_blank')}
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 w-full max-w-xs">
                                                                        <div className="flex items-center">
                                                                            <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                                                            <span className="text-sm text-gray-700 truncate">
                                                                                Document {dlDocument ? dlDocument.name : "File"}
                                                                            </span>
                                                                            {isEditing && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="ml-auto w-8 h-8 rounded-full p-0"
                                                                                    type="button"
                                                                                    onClick={() => window.open(previewDl, '_blank')}
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {isEditing && (
                                                                    <div className="text-sm text-center text-muted-foreground">
                                                                        <label htmlFor="license_image" className="cursor-pointer">
                                                                            <span className="font-medium">Change file</span>
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                                <div className="text-sm text-center text-muted-foreground">
                                                                    <label htmlFor="license_image" className={`cursor-pointer ${!isEditing || isUpdating ? 'pointer-events-none' : ''}`}>
                                                                        <span className="font-medium">Click to upload</span> or drag and drop
                                                                    </label>
                                                                    <p>PDF, JPG or PNG (max. 5MB)</p>
                                                                </div>
                                                            </>
                                                        )}
                                                        <Input
                                                            id="license_image"
                                                            name="license_image"
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleDLDocumentChange}
                                                            disabled={!isEditing || isUpdating}
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                        />
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </CardContent>
                                </Card>

                                {/* Aadhaar Card section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <CreditCard size={20} />
                                            <span>Aadhaar Card</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-1">
                                        <FormItem>
                                            <FormLabel>Upload Aadhaar Card</FormLabel>
                                            <FormControl>
                                                <div className={`border rounded-md border-input p-2 ${!isEditing ? 'bg-gray-100' : ''}`}>
                                                    <div className="flex items-center justify-center flex-col p-4">
                                                        {previewAadhaar ? (
                                                            <div className="w-full flex flex-col items-center">
                                                                {isImageFile(previewAadhaar) ? (
                                                                    <div className="relative mb-4 w-full max-w-xs">
                                                                        <img 
                                                                            src={previewAadhaar} 
                                                                            alt="Aadhaar Card Preview" 
                                                                            className="max-h-40 object-contain rounded-md border border-gray-200 w-full"
                                                                        />
                                                                        {isEditing && (
                                                                            <div className="absolute top-2 right-2">
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    className="w-8 h-8 rounded-full p-0"
                                                                                    type="button"
                                                                                    onClick={() => window.open(previewAadhaar, '_blank')}
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 w-full max-w-xs">
                                                                        <div className="flex items-center">
                                                                            <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                                                            <span className="text-sm text-gray-700 truncate">
                                                                                Document {aadhaarDocument ? aadhaarDocument.name : "File"}
                                                                            </span>
                                                                            {isEditing && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="ml-auto w-8 h-8 rounded-full p-0"
                                                                                    type="button"
                                                                                    onClick={() => window.open(previewAadhaar, '_blank')}
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {isEditing && (
                                                                    <div className="text-sm text-center text-muted-foreground">
                                                                        <label htmlFor="aadhaar_image" className="cursor-pointer">
                                                                            <span className="font-medium">Change file</span>
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                                <div className="text-sm text-center text-muted-foreground">
                                                                    <label htmlFor="aadhaar_image" className={`cursor-pointer ${!isEditing || isUpdating ? 'pointer-events-none' : ''}`}>
                                                                        <span className="font-medium">Click to upload</span> or drag and drop
                                                                    </label>
                                                                    <p>PDF, JPG or PNG (max. 5MB)</p>
                                                                </div>
                                                            </>
                                                        )}
                                                        <Input
                                                            id="aadhaar_image"
                                                            name="aadhaar_image"
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleAadhaarDocumentChange}
                                                            disabled={!isEditing || isUpdating}
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                        />
                                                      
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </CardContent>
                                </Card>

                                {isEditing && (
                                    <Button type="submit" className="w-full" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving Documents...
                                            </>
                                        ) : (
                                            "Save Documents"
                                        )}
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}