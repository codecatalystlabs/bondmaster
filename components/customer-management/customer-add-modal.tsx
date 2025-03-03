"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Customer } from "@/types/customer";
import { addCustomerContact, addCustomerAddress } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";
import useUserStore from "@/app/store/userStore";

// Form schemas
const contactFormSchema = z.object({
  contact_type: z.string().min(1, "Contact type is required"),
  contact_information: z.string().min(1, "Contact information is required"),
});

const addressFormSchema = z.object({
  district: z.string().min(1, "District is required"),
  subcounty: z.string().min(1, "Subcounty is required"),
  parish: z.string().min(1, "Parish is required"),
  village: z.string().min(1, "Village is required"),
});

interface CustomerAddModalProps {
  customer: Customer;
  type: "contact" | "address";
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CustomerAddModal({
  customer,
  type,
  isOpen,
  onClose,
  onSuccess,
}: CustomerAddModalProps) {
  const user = useUserStore((state) => state.user);
  
  // Contact form setup
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      contact_type: "",
      contact_information: "",
    },
  });
  
  // Address form setup
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
          customer_id: customer.ID,
          contact_type: values.contact_type,
          contact_information: values.contact_information,
          created_by: user?.username || "admin",
          updated_by: user?.username || "admin",
        }
      });
      
      if (response.status === "success") {
        toast.success("Contact added successfully");
        contactForm.reset();
        if (onSuccess) onSuccess();
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
          customer_id: customer.ID,
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
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("An error occurred while adding address");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === "contact" ? "Add Contact" : "Add Address"} for {customer.surname} {customer.firstname}
          </DialogTitle>
        </DialogHeader>
        
        {type === "contact" ? (
          <Form {...contactForm}>
            <form onSubmit={contactForm.handleSubmit(handleAddContact)} className="space-y-4">
              <FormField
                control={contactForm.control}
                name="contact_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
              
              <Button type="submit">Add Contact</Button>
            </form>
          </Form>
        ) : (
          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(handleAddAddress)} className="space-y-4">
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
              
              <Button type="submit">Add Address</Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 