"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { planSchema, PlanFormData, FeatureItem } from "@/lib/validations/plan";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/store/api/plan-api";
import { getErrorMessage } from "@/types/api";
import { IPlan } from "@/types/plan";
import { cn } from "@/lib/utils";

interface SortableFeatureItemProps {
  feature: FeatureItem;
  onRemove: (id: string) => void;
}

function SortableFeatureItem({ feature, onRemove }: SortableFeatureItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-3 rounded-lg border bg-white transition-all",
        isDragging && "opacity-50 shadow-lg border-brand"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="flex-1 text-sm">{feature.text}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(feature.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface PlanFormProps {
  plan?: IPlan | null;
  onSuccess: () => void;
}

export function PlanForm({ plan, onSuccess }: PlanFormProps) {
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [newFeature, setNewFeature] = useState("");
  const [featuresList, setFeaturesList] = useState<FeatureItem[]>([]);

  const isLoading = isCreating || isUpdating;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      interval: "month",
      maxLinks: 100,
      maxClicks: 10000,
      maxDevices: 1,
      isActive: true,
      features: {
        customCodes: false,
        analytics: false,
        apiAccess: false,
        prioritySupport: false,
      },
      featuresList: [],
    },
  });

  useEffect(() => {
    if (plan) {
      const existingFeatures = (plan as any).featuresList || [];
      setFeaturesList(existingFeatures);
      // Handle price which can be a number or { monthly, yearly } object
      const priceValue = typeof plan.price === "number"
        ? plan.price
        : plan.price?.monthly || 0;
      form.reset({
        name: plan.name,
        description: plan.description || "",
        price: priceValue,
        interval: plan.interval,
        maxLinks: plan.maxLinks,
        maxClicks: plan.maxClicks,
        maxDevices: plan.features?.maxDevices || 1,
        isActive: plan.isActive,
        features: plan.features || {
          customCodes: false,
          analytics: false,
          apiAccess: false,
          prioritySupport: false,
        },
        featuresList: existingFeatures,
      });
    }
  }, [plan, form]);

  const addFeature = () => {
    if (!newFeature.trim()) return;

    const newItem: FeatureItem = {
      id: `feature-${Date.now()}`,
      text: newFeature.trim(),
      order: featuresList.length,
    };

    const updatedList = [...featuresList, newItem];
    setFeaturesList(updatedList);
    form.setValue("featuresList", updatedList);
    setNewFeature("");
  };

  const removeFeature = (id: string) => {
    const updatedList = featuresList
      .filter((f) => f.id !== id)
      .map((f, index) => ({ ...f, order: index }));
    setFeaturesList(updatedList);
    form.setValue("featuresList", updatedList);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = featuresList.findIndex((f) => f.id === active.id);
      const newIndex = featuresList.findIndex((f) => f.id === over.id);

      const reorderedList = arrayMove(featuresList, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setFeaturesList(reorderedList);
      form.setValue("featuresList", reorderedList);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  async function onSubmit(data: PlanFormData) {
    try {
      const submitData = {
        ...data,
        featuresList: featuresList,
      };

      if (plan) {
        await updatePlan({ id: plan._id || plan.id, data: submitData }).unwrap();
        toast.success("Plan Updated", {
          description: "The plan has been updated successfully.",
        });
      } else {
        await createPlan(submitData).unwrap();
        toast.success("Plan Created", {
          description: "The new plan has been created successfully.",
        });
      }
      onSuccess();
    } catch (error: unknown) {
      toast.error("Save Failed", {
        description: getErrorMessage(error, "Unable to save plan"),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Interval</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Best for professionals" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription className="text-xs">&nbsp;</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxDevices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Devices</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="-1 for unlimited"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription className="text-xs">-1 = unlimited</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Links</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="-1 for unlimited"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription className="text-xs">-1 = unlimited</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxClicks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Clicks/mo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="-1 for unlimited"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription className="text-xs">-1 = unlimited</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel className="text-base">Quick Features</FormLabel>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <FormField
              control={form.control}
              name="features.customCodes"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Custom short codes</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features.analytics"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Advanced analytics</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features.apiAccess"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">API access</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features.prioritySupport"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Priority support</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Custom Features List */}
        <div className="space-y-3">
          <FormLabel className="text-base">Features List</FormLabel>
          <FormDescription>
            Add custom features that will be displayed on the pricing card. Drag to reorder.
          </FormDescription>

          {/* Add Feature Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter a feature (e.g., Unlimited storage)"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addFeature}
              disabled={!newFeature.trim()}
              variant="outline"
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Features List with Drag and Drop */}
          {featuresList.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={featuresList.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 mt-3">
                  {featuresList.map((feature) => (
                    <SortableFeatureItem
                      key={feature.id}
                      feature={feature}
                      onRemove={removeFeature}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-6 border rounded-lg border-dashed">
              <p className="text-sm text-muted-foreground">
                No features added yet. Add features above to display them on the pricing card.
              </p>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Make this plan available for new subscriptions
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="bg-brand hover:bg-brand/90">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plan ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
