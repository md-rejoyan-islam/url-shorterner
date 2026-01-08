"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  GripVertical,
  Loader2,
  Package,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FeatureItem, PlanFormData, planSchema } from "@/lib/validations/plan";
import { useGetPlanQuery, useUpdatePlanMutation } from "@/store/api/plan-api";
import { getErrorMessage } from "@/types/api";
import Link from "next/link";

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

interface EditPlanContentProps {
  planId: string;
}

export function EditPlanContent({ planId }: EditPlanContentProps) {
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetPlanQuery(planId);
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [newFeature, setNewFeature] = useState("");
  const [featuresList, setFeaturesList] = useState<FeatureItem[]>([]);

  const plan = data?.data;

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

  // Populate form when plan data is loaded
  useEffect(() => {
    if (plan) {
      const existingFeatures = plan.featuresList || [];
      setFeaturesList(existingFeatures);

      // Extract price value - handle both number and object formats
      const priceValue = typeof plan.price === "number"
        ? plan.price
        : (plan.interval === "year" ? plan.price?.yearly : plan.price?.monthly) || 0;

      form.reset({
        name: plan.name,
        description: plan.description || "",
        price: priceValue,
        interval: plan.interval || "month",
        maxLinks: plan.maxLinks,
        maxClicks: plan.maxClicks,
        isActive: plan.isActive,
        features: {
          customCodes: plan.features?.customCodes || false,
          analytics: plan.features?.analytics || false,
          apiAccess: plan.features?.apiAccess || false,
          prioritySupport: plan.features?.prioritySupport || false,
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

      await updatePlan({ id: planId, data: submitData }).unwrap();
      toast.success("Plan Updated", {
        description: "The plan has been updated successfully.",
      });
      router.push("/admin/plans");
    } catch (error: unknown) {
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Unable to update plan"),
      });
    }
  }

  if (!isFetching && !plan) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Plan not found</p>
          <Button asChild variant="outline">
            <Link href="/admin/plans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title={isFetching ? "Loading..." : `Edit Plan: ${plan?.name}`}
        badge={{ icon: Package, text: "Admin Panel" }}
        description="Update subscription plan details"
        actions={
          <Button
            asChild
            variant="outline"
            className="bg-white/90 text-primary hover:bg-white"
          >
            <Link href="/admin/plans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Link>
          </Button>
        }
      />

      <Card className="border py-6 border-primary/15 shadow-none bg-white">
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                        <Input
                          placeholder="Best for professionals"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-4">
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
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
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
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          -1 = unlimited
                        </FormDescription>
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
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          -1 = unlimited
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel className="text-base">Quick Features</FormLabel>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
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
                          <FormLabel className="font-normal">
                            Custom short codes
                          </FormLabel>
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
                          <FormLabel className="font-normal">
                            Advanced analytics
                          </FormLabel>
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
                          <FormLabel className="font-normal">
                            API access
                          </FormLabel>
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
                          <FormLabel className="font-normal">
                            Priority support
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Custom Features List */}
                <div className="space-y-3">
                  <FormLabel className="text-base">Features List</FormLabel>
                  <FormDescription>
                    Add custom features that will be displayed on the pricing
                    card. Drag to reorder.
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
                        No features added yet. Add features above to display
                        them on the pricing card.
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
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-brand hover:bg-brand/90"
                  >
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Plan
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/plans">Cancel</Link>
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
