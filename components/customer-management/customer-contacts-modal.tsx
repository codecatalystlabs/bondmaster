"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher, addCustomerContact, addCustomerAddress, deleteCustomerContact, deleteCustomerAddress } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader } from "@/components/ui/loader";
import useUserStore from "@/app/store/userStore";
import { Phone, MapPin, Trash2 } from "lucide-react";

// Contact form schema
const contactFormSchema = z.object({
  contact_type: z.string().min(1, "Contact type is required"),
  contact_information: z.string().min(1, "Contact information is required"),
});

// Address form schema
const addressFormSchema = z.object({
  district: z.string().min(1, "District is required"),
  subcounty: z.string().min(1, "Subcounty is required"),
  parish: z.string().min(1, "Parish is required"),
  village: z.string().min(1, "Village is required"),
});

interface CustomerContactsModalProps {
  customerId: number;
  customerName: string;
  contacts: any[];
  addresses: any[];
  isOpen: boolean;
  onClose: () => void;
  onDataChange?: () => void;
}

export function CustomerContactsModal({
  customerId,
  customerName,
  contacts,
  addresses,
  isOpen,
  onClose,
  onDataChange,
}: CustomerContactsModalProps) {
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("contacts");
  
  // Forms
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      contact_type: "",
      contact_information: "",
    },
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      district: "",
      subcounty: "",
      parish: "",
      village: "",
    },
  });

  // Handle adding a new contact
  const handleAddContact = async (values: z.infer<typeof contactFormSchema>) => {
    try {
      const response = await addCustomerContact({
        url: `${BASE_URL}/customer/contact`,
        contactInfo: {
          customer_id: customerId,
          contact_type: values.contact_type,
          contact_information: values.contact_information,
          created_by: user?.username || "admin",
          updated_by: user?.username || "admin",
        }
      });
      
      if (response.status === "success") {
        toast.success("Contact added successfully");
        contactForm.reset();
        if (onDataChange) onDataChange();
      } else {
        toast.error(response.message || "Failed to add contact");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("An error occurred while adding contact");
    }
  };

  // Handle adding a new address
  const handleAddAddress = async (values: z.infer<typeof addressFormSchema>) => {
    try {
      const response = await addCustomerAddress({
        url: `${BASE_URL}/customer/address`,
        addressInfo: {
          customer_id: customerId,
          district: values.district,
          subcounty: values.subcounty,
          parish: values.parish,
          village: values.village,
          created_by: user?.username || "admin",
          updated_by: user?.username || "admin",
        }
      });
      
      if (response.status === "success") {
        toast.success("Address added successfully");
        addressForm.reset();
        if (onDataChange) onDataChange();
      } else {
        toast.error(response.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("An error occurred while adding address");
    }
  };

  // Handle deleting a contact
  const handleDeleteContact = async (contactId: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    
    try {
      const response = await deleteCustomerContact(`${BASE_URL}/customer/contact/${contactId}`);
      
      if (response.status === "success") {
        toast.success("Contact deleted successfully");
        if (onDataChange) onDataChange();
      } else {
        toast.error(response.message || "Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("An error occurred while deleting contact");
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const response = await deleteCustomerAddress(`${BASE_URL}/customer/address/${addressId}`);
      
      if (response.status === "success") {
        toast.success("Address deleted successfully");
        if (onDataChange) onDataChange();
      } else {
        toast.error(response.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("An error occurred while deleting address");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Customer Details: {customerName}</DialogTitle>
          <DialogDescription>
            Manage contact information and addresses for this customer.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="contacts" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="contacts">
              <Phone className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            <h3 className="font-medium text-lg">Contact Information</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Information</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <TableRow key={contact.ID}>
                      <TableCell>{contact.contact_type}</TableCell>
                      <TableCell>{contact.contact_information}</TableCell>
                      <TableCell>{contact.created_by}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContact(contact.ID)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No contacts found for this customer
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Form {...contactForm}>
              <form 
                onSubmit={contactForm.handleSubmit(handleAddContact)} 
                className="space-y-4 pt-4 border-t"
              >
                <h4 className="font-medium">Add New Contact</h4>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={contactForm.control}
                    name="contact_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="Mobile">Mobile</SelectItem>
                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="contact_information"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter contact information" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button type="submit">Add Contact</Button>
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-4">
            <h3 className="font-medium text-lg">Address Information</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Subcounty</TableHead>
                  <TableHead>Parish</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <TableRow key={address.ID}>
                      <TableCell>{address.district}</TableCell>
                      <TableCell>{address.subcounty}</TableCell>
                      <TableCell>{address.parish}</TableCell>
                      <TableCell>{address.village}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.ID)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No addresses found for this customer
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Form {...addressForm}>
              <form 
                onSubmit={addressForm.handleSubmit(handleAddAddress)} 
                className="space-y-4 pt-4 border-t"
              >
                <h4 className="font-medium">Add New Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter district" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="subcounty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcounty</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter subcounty" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="parish"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parish</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter parish" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Village</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter village" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Add Address</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 