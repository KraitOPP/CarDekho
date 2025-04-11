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
import { Loader2, User, MapPin, FileText, Lock, Upload, CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";
import { useGetProfileInfoQuery, useUpdateProfileMutation } from "@/slices/authApiSlice";

export default function ProfilePage(){
    const { data: userInfo, isLoading, isError } = useGetProfileInfoQuery({});
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [dlDocument, setDlDocument] = useState<File | null>(null);
    const [aadhaarDocument, setAadhaarDocument] = useState<File | null>(null);
    
    const user = userInfo?.user;
    
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone_number: "",
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
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

    const formInitialized = useRef(false);
    
    useEffect(() => {
        if (user && Object.keys(user).length > 0 && !formInitialized.current) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                phone_number: user.phone_number || "",
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
                license_number: user.license_number || "",
                address: {
                    house_no: user.house_no || "",
                    street: user.street || "",
                    area: user.area || "",
                    city: user.city || "",
                    state: user.state || "",
                    zip_code: user.zip_code || "",
                    country: user.country || "",
                },
            });
            formInitialized.current = true;
        }
    }, [user, form]);

    async function onSubmit(data: any) {
        try {
            if ((data.newPassword || data.confirmNewPassword) && data.newPassword !== data.confirmNewPassword) {
                toast.warning("Passwords do not match",{
                    description: "Please ensure the new passwords are identical."
                });
                return;
            }

            const formData = new FormData();
            
            const permanentAddress = {
                house_no: data.address.house_no,
                street: data.address.street,
                area: data.address.area,
                city: data.address.city,
                state: data.address.state,
                zip_code: data.address.zip_code,
                country: data.address.country
            };

            const updatePayload = {
                email: data.email,
                phoneNumber: data.phone_number,
                licenseNumber: data.license_number,
                permanentAddress,
                temporaryAddress: null
            };

            if (data.oldPassword && data.newPassword) {
                updatePayload.oldPassword = data.oldPassword;
                updatePayload.newPassword = data.newPassword;
            }

            if (aadhaarDocument) {
                const reader = new FileReader();
                reader.readAsDataURL(aadhaarDocument);
                reader.onload = async () => {
                    const base64String = reader.result?.toString().split(',')[1];
                    if (base64String) {
                        updatePayload.aadhaarImage = base64String;
                    }
                };
            }

            if (dlDocument) {
                const reader = new FileReader();
                reader.readAsDataURL(dlDocument);
                reader.onload = async () => {
                    const base64String = reader.result?.toString().split(',')[1];
                    if (base64String) {
                        updatePayload.licenseImage = base64String;
                    }
                };
            }

            const result = await updateProfile(updatePayload).unwrap();
            
            toast.success("Profile Updated Successfully",{ 
                description: result.message || "Your profile has been updated."
            });
            
            setIsEditing(false);
        } catch (err: any) {
            toast.error("Update Failed",{ 
                description: err.data?.error || "An error occurred while updating your profile."
            });
        }
    }

    const handleDLDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDlDocument(e.target.files[0]);
            toast("Driving License Document Selected",{ description: e.target.files[0].name });
        }
    };

    const handleAadhaarDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAadhaarDocument(e.target.files[0]);
            toast("Aadhaar Document Selected",{description: e.target.files[0].name });
        }
    };

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
                        disabled={isUpdating}
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <User size={20} />
                                            <span>Personal Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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
                                            control={form.control}
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

                    {/* Security Tab - Now Separated */}
                    <TabsContent value="security">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lock size={20} />
                                            <span>Password Management</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="oldPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div></div> {/* Empty div for grid alignment */}
                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={!isEditing || isUpdating} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmNewPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={!isEditing || isUpdating} />
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
                                                <span>Enable two-factor authentication for additional security</span>
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
                                    <Button type="submit" className="w-full" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating Security Settings...
                                            </>
                                        ) : (
                                            "Update Security Settings"
                                        )}
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>

                    {/* Documents Tab for Driving License and Aadhaar */}
                    <TabsContent value="documents">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <FileText size={20} />
                                            <span>Driving License</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
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
                                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <Input
                                                            id="dlDocument"
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleDLDocumentChange}
                                                            disabled={!isEditing || isUpdating}
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                        />
                                                        {dlDocument ? (
                                                            <div className="text-sm text-center">
                                                                <p className="font-medium">{dlDocument.name}</p>
                                                                <p className="text-muted-foreground">{(dlDocument.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-center text-muted-foreground">
                                                                <label htmlFor="dlDocument" className={`cursor-pointer ${!isEditing || isUpdating ? 'pointer-events-none' : ''}`}>
                                                                    <span className="font-medium">Click to upload</span> or drag and drop
                                                                </label>
                                                                <p>PDF, JPG or PNG (max. 5MB)</p>
                                                            </div>
                                                        )}
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
                                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <Input
                                                            id="aadhaarDocument"
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleAadhaarDocumentChange}
                                                            disabled={!isEditing || isUpdating}
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                        />
                                                        {aadhaarDocument ? (
                                                            <div className="text-sm text-center">
                                                                <p className="font-medium">{aadhaarDocument.name}</p>
                                                                <p className="text-muted-foreground">{(aadhaarDocument.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-center text-muted-foreground">
                                                                <label htmlFor="aadhaarDocument" className={`cursor-pointer ${!isEditing || isUpdating ? 'pointer-events-none' : ''}`}>
                                                                    <span className="font-medium">Click to upload</span> or drag and drop
                                                                </label>
                                                                <p>PDF, JPG or PNG (max. 5MB)</p>
                                                            </div>
                                                        )}
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