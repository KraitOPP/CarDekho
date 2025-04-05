"use client"

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
import { Loader2, User, MapPin, Package, Lock, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ProfilePage(){
    const user = {}; 
    const [isEditing, setIsEditing] = useState(false);
    const [dlDocument, setDlDocument] = useState<File | null>(null);
    const [identityDocument, setIdentityDocument] = useState<File | null>(null);

    // Initialize form with default values
    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                postalCode: ""
            },
            drivingLicense: {
                number: "",
            },
            identityVerification: {
                type: "",
                number: "",
            }
        },
    });

    const passwordForm = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    // Only reset the form once when user data is available
    const formInitialized = useRef(false);
    
    useEffect(() => {
        // Only reset if user data exists and form hasn't been initialized yet
        if (user && Object.keys(user).length > 0 && !formInitialized.current) {
            form.reset(user);
            formInitialized.current = true;
        }
    }, [user, form]);

    async function onSubmit(data: any) {
        // Create a new object for submission to avoid modifying the form state directly
        const submitData = {
            ...data,
            drivingLicense: {
                ...data.drivingLicense,
                documentFile: dlDocument
            },
            identityVerification: {
                ...data.identityVerification,
                documentFile: identityDocument
            }
        };
        
        console.log("Submitting data:", submitData);
        
        // API call would go here
        toast({ title: "Profile Updated Successfully" });
        setIsEditing(false);
    }

    async function onPasswordSubmit(data: any) {
        if (data.newPassword !== data.confirmNewPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please ensure the new passwords are identical.",
                variant: "destructive",
            });
            return;
        }
        
        console.log("Submitting password update:", data);
        
        // API call would go here
        toast({ title: "Password Updated Successfully" });
        passwordForm.reset();
    }

    const handleDLDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDlDocument(e.target.files[0]);
            toast({ title: "Driving License Document Selected", description: e.target.files[0].name });
        }
    };

    const handleIdentityDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIdentityDocument(e.target.files[0]);
            toast({ title: "Identity Document Selected", description: e.target.files[0].name });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "destructive" : "outline"}
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
                        <TabsTrigger value="documents" className="space-x-2">
                            <FileText size={16} />
                            <span>Documents</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="space-x-2">
                            <Lock size={16} />
                            <span>Security</span>
                        </TabsTrigger>
                    </TabsList>

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
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
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
                                                        <Input {...field} type="email" disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="tel" disabled={!isEditing} />
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
                                            name="address.street"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Street Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
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
                                                        <Input {...field} disabled={!isEditing} />
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
                                                        <Input {...field} disabled={!isEditing} />
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
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address.postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {isEditing && (
                                    <Button
                                        type="submit"
                                        className="w-full"
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>

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
                                            name="drivingLicense.number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Driving License Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
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
                                                            disabled={!isEditing}
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                        />
                                                        {dlDocument ? (
                                                            <div className="text-sm text-center">
                                                                <p className="font-medium">{dlDocument.name}</p>
                                                                <p className="text-muted-foreground">{(dlDocument.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-center text-muted-foreground">
                                                                <label htmlFor="dlDocument" className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}>
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

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <FileText size={20} />
                                            <span>Identity Verification</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="identityVerification.type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID Document Type</FormLabel>
                                                    <Select 
                                                        disabled={!isEditing} 
                                                        onValueChange={field.onChange} 
                                                        value={field.value || undefined}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select ID type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                                                            <SelectItem value="pan">PAN Card</SelectItem>
                                                            <SelectItem value="voter">Voter ID</SelectItem>
                                                            <SelectItem value="passport">Passport</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="identityVerification.number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormItem className="col-span-2">
                                            <FormLabel>Upload Identity Document</FormLabel>
                                            <FormControl>
                                                <div className={`border rounded-md border-input p-2 ${!isEditing ? 'bg-gray-100' : ''}`}>
                                                    <div className="flex items-center justify-center flex-col p-4">
                                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <Input
                                                            id="identityDocument"
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleIdentityDocumentChange}
                                                            disabled={!isEditing}
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                        />
                                                        {identityDocument ? (
                                                            <div className="text-sm text-center">
                                                                <p className="font-medium">{identityDocument.name}</p>
                                                                <p className="text-muted-foreground">{(identityDocument.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-center text-muted-foreground">
                                                                <label htmlFor="identityDocument" className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}>
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
                                    <Button
                                        type="submit"
                                        className="w-full"
                                    >
                                        Save Documents
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="security">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lock size={20} />
                                            <span>Update Password</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={passwordForm.control}
                                            name="oldPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Old Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
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
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                                <Button type="submit" className="w-full">
                                    Update Password
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}