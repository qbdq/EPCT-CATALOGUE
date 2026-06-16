'use client';

import Link from 'next/link';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  type PublicBrand,
  type PublicCategory,
  type PublicProduct,
  type PublicTruckCategory,
  type PublicTruckModel,
  getMediaUrl,
} from '@/lib/public-api';
import type { SiteLocale } from '@/components/site/LocaleProvider';
import { ProtectedImage } from '@/components/media/ProtectedImage';

type CatalogueExplorerProps = {
  products: PublicProduct[];
  brands: PublicBrand[];
  categories: PublicCategory[];
  truckCategories: PublicTruckCategory[];
  truckModels: PublicTruckModel[];
  locale: SiteLocale;
  initialFilters?: {
    brands?: string[];
    productCategories?: string[];
    categories?: string[];
    models?: string[];
    stockStatuses?: string[];
    query?: string;
  };
};

const PRODUCTS_PER_PAGE = 12;

const catalogueCopy = {
  fr: {
    filters: 'Filtres',
    search: 'Recherche',
    searchPlaceholder: 'Nom, description, code...',
    brands: 'Marques',
    truckCategories: 'Categories camion',
    productCategories: 'Categories produits',
    truckModels: 'Modeles camion',
    availability: 'Disponibilite',
    select: 'Selectionner',
    searchDropdown: 'Recherche',
    noAvailableValues: 'Aucune valeur disponible.',
    noActiveFilters: 'Aucun filtre actif pour le moment.',
    resetFilters: 'Reinitialiser les filtres',
    hideFilters: 'Masquer les filtres',
    showFilters: 'Afficher les filtres',
    refineMobile: 'Affinez votre recherche mobile',
    closeFilters: 'Fermer les filtres',
    close: 'Fermer',
    kanban: 'Kanban',
    list: 'Liste',
    image: 'Image',
    title: 'Titre',
    reference: 'Reference',
    brand: 'Marque',
    truckCategory: 'Categorie camion',
    previous: 'Precedent',
    next: 'Suivant',
    noProducts: 'Aucun produit ne correspond aux filtres choisis.',
    selection: 'selection',
    selections: 'selections',
    ref: 'Ref.',
    inStock: 'En stock',
    outOfStock: 'Rupture de stock',
    onOrder: 'Sur commande',
  },
  en: {
    filters: 'Filters',
    search: 'Search',
    searchPlaceholder: 'Name, description, code...',
    brands: 'Brands',
    truckCategories: 'Truck categories',
    productCategories: 'Product categories',
    truckModels: 'Truck models',
    availability: 'Availability',
    select: 'Select',
    searchDropdown: 'Search',
    noAvailableValues: 'No available values.',
    noActiveFilters: 'No active filters at the moment.',
    resetFilters: 'Reset filters',
    hideFilters: 'Hide filters',
    showFilters: 'Show filters',
    refineMobile: 'Refine your mobile search',
    closeFilters: 'Close filters',
    close: 'Close',
    kanban: 'Kanban',
    list: 'List',
    image: 'Image',
    title: 'Title',
    reference: 'Reference',
    brand: 'Brand',
    truckCategory: 'Truck category',
    previous: 'Previous',
    next: 'Next',
    noProducts: 'No products match the selected filters.',
    selection: 'selection',
    selections: 'selections',
    ref: 'Ref.',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    onOrder: 'On order',
  },
  ar: {
    filters: 'الفلاتر',
    search: 'بحث',
    searchPlaceholder: 'الاسم، الوصف، الرمز...',
    brands: 'العلامات التجارية',
    truckCategories: 'فئات الشاحنات',
    productCategories: 'فئات المنتجات',
    truckModels: 'طرازات الشاحنات',
    availability: 'التوفر',
    select: 'اختر',
    searchDropdown: 'بحث',
    noAvailableValues: 'لا توجد قيم متاحة.',
    noActiveFilters: 'لا توجد فلاتر مفعلة حاليا.',
    resetFilters: 'إعادة تعيين الفلاتر',
    hideFilters: 'إخفاء الفلاتر',
    showFilters: 'إظهار الفلاتر',
    refineMobile: 'حسّن بحثك على الهاتف',
    closeFilters: 'إغلاق الفلاتر',
    close: 'إغلاق',
    kanban: 'بطاقات',
    list: 'قائمة',
    image: 'الصورة',
    title: 'العنوان',
    reference: 'المرجع',
    brand: 'العلامة',
    truckCategory: 'فئة الشاحنة',
    previous: 'السابق',
    next: 'التالي',
    noProducts: 'لا توجد منتجات تطابق الفلاتر المحددة.',
    selection: 'اختيار',
    selections: 'اختيارات',
    ref: 'المرجع',
    inStock: 'متوفر',
    outOfStock: 'نفد المخزون',
    onOrder: 'حسب الطلب',
  },
} as const;

function getStockMeta(locale: SiteLocale): Record<string, { label: string; className: string }> {
  const copy = catalogueCopy[locale];
  return {
    'in-stock': { label: copy.inStock, className: 'bg-emerald-600 text-white' },
    'out-of-stock': { label: copy.outOfStock, className: 'bg-red-600 text-white' },
    'on-order': { label: copy.onOrder, className: 'bg-orange-500 text-white' },
  };
}

function getRelationSlug(relation?: { slug?: string } | string | null) {
  return typeof relation === 'string' ? relation : relation?.slug;
}

function getRelationId(relation?: { id?: string } | string | null) {
  return typeof relation === 'string' ? relation : relation?.id;
}

function getModelRelations(
  relation?:
    | { id?: string; name: string; slug: string }
    | string
    | Array<{ id?: string; name: string; slug: string } | string>
    | null,
) {
  if (!relation) return [];
  return Array.isArray(relation) ? relation : [relation];
}

function getRelationArray(
  relation?:
    | { id?: string; name?: string; slug?: string; badgeColor?: string }
    | string
    | Array<{ id?: string; name?: string; slug?: string; badgeColor?: string } | string>
    | null,
) {
  if (!relation) return [];
  return Array.isArray(relation) ? relation : [relation];
}

function truncateText(value: string | null | undefined, maxLength: number) {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function matchesSelected(values: string[], relation?: { id?: string; slug?: string } | string | null) {
  if (!values.length) return true;
  const slug = getRelationSlug(relation);
  const id = getRelationId(relation);
  return (!!slug && values.includes(slug)) || (!!id && values.includes(id));
}

function matchesSelectedMany(
  values: string[],
  relation?:
    | { id?: string; slug?: string }
    | string
    | Array<{ id?: string; slug?: string } | string>
    | null,
) {
  if (!values.length) return true;
  return getRelationArray(relation).some((item) => matchesSelected(values, item));
}

type FilterPickerProps<T extends { id: string; name: string; slug: string }> = {
  copy: (typeof catalogueCopy)[SiteLocale];
  pickerKey: string;
  openPicker: string | null;
  setOpenPicker: (value: string | null) => void;
  title: string;
  options: T[];
  selectedValues: string[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleValue: (value: string) => void;
  placeholder: string;
};

function FilterPicker<T extends { id: string; name: string; slug: string }>({
  copy,
  pickerKey,
  openPicker,
  setOpenPicker,
  title,
  options,
  selectedValues,
  searchValue,
  onSearchChange,
  onToggleValue,
  placeholder,
}: FilterPickerProps<T>) {
  const open = openPicker === pickerKey;

  const filteredOptions = options;

  return (
    <div className="relative min-w-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-epct-ink/62">{title}</p>
      <button
        type="button"
        onClick={() => setOpenPicker(open ? null : pickerKey)}
        className="flex h-12 w-full items-center justify-between rounded-sm border border-epct-ink/10 bg-white px-4 text-left transition hover:border-epct-green/35"
      >
        <p className="truncate text-sm text-epct-dark/82">
          {selectedValues.length
            ? `${selectedValues.length} ${selectedValues.length > 1 ? copy.selections : copy.selection}`
            : placeholder}
        </p>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-epct-ink/45 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Fermer le filtre"
            onClick={() => setOpenPicker(null)}
            className="fixed inset-0 z-20 cursor-default"
          />
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-sm border border-epct-ink/10 bg-white shadow-[0_18px_36px_rgba(16,24,40,0.12)]">
            <div className="border-b border-epct-ink/10 px-3 py-3">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-epct-ink/35" />
                <input
                  autoFocus
                  type="search"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder={copy.searchDropdown}
                  className="h-10 w-full rounded-sm border border-epct-ink/10 bg-[#fcfcfb] pl-10 pr-3 text-sm outline-none transition focus:border-epct-green"
                />
              </label>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const value = option.slug || option.id;
                  const selected =
                    selectedValues.includes(option.slug) || selectedValues.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onToggleValue(value)}
                      className={`flex min-h-11 w-full items-center justify-between border-b border-epct-ink/8 px-3 text-left text-sm last:border-b-0 ${
                        selected
                          ? 'bg-epct-green/8 text-epct-green'
                          : 'text-epct-ink/82 hover:bg-[#f8f8f6]'
                      }`}
                    >
                      <span className="line-clamp-1">{option.name}</span>
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-sm border text-xs font-bold ${
                          selected
                            ? 'border-epct-green bg-epct-green text-white'
                            : 'border-epct-ink/15 text-epct-ink/45'
                        }`}
                      >
                        {selected ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-epct-ink/55">{copy.noAvailableValues}</div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function CatalogueExplorer({
  products,
  brands,
  categories,
  truckCategories,
  truckModels,
  locale,
  initialFilters,
}: CatalogueExplorerProps) {
  const copy = catalogueCopy[locale];
  const stockMeta = getStockMeta(locale);
  const [query, setQuery] = useState(initialFilters?.query ?? '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters?.brands ?? []);
  const [selectedProductCategories, setSelectedProductCategories] = useState<string[]>(
    initialFilters?.productCategories ?? [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories ?? [],
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(initialFilters?.models ?? []);
  const [selectedStockStatuses, setSelectedStockStatuses] = useState<string[]>(
    initialFilters?.stockStatuses ?? [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [brandQuery, setBrandQuery] = useState('');
  const [productCategoryQuery, setProductCategoryQuery] = useState('');
  const [truckCategoryQuery, setTruckCategoryQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [openFilterPicker, setOpenFilterPicker] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    function syncMobileView() {
      if (window.innerWidth < 1024) {
        setViewMode('kanban');
      }
    }

    syncMobileView();
    window.addEventListener('resize', syncMobileView);
    return () => window.removeEventListener('resize', syncMobileView);
  }, []);

  useEffect(() => {
    function closeFiltersOnScroll() {
      setOpenFilterPicker(null);
      setMobileFiltersOpen(false);
      setFiltersExpanded(false);
    }

    if (!mobileFiltersOpen && !filtersExpanded && !openFilterPicker) return;

    window.addEventListener('scroll', closeFiltersOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', closeFiltersOnScroll);
  }, [filtersExpanded, mobileFiltersOpen, openFilterPicker]);

  function toggleValue(value: string, values: string[], setValues: (values: string[]) => void) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  const activeProducts = useMemo(() => products.filter((product) => product.active !== false), [products]);

  const availableBrandIds = useMemo(
    () =>
      new Set(
        activeProducts
          .flatMap((product) =>
            getRelationArray(product.brand).map((brand) => getRelationId(brand) || getRelationSlug(brand)),
          )
          .filter(Boolean),
      ),
    [activeProducts],
  );

  const availableProductCategoryIds = useMemo(
    () =>
      new Set(
        activeProducts
          .map((product) => getRelationId(product.category) || getRelationSlug(product.category))
          .filter(Boolean),
      ),
    [activeProducts],
  );

  const availableTruckCategoryIds = useMemo(
    () =>
      new Set(
        activeProducts
          .map((product) => getRelationId(product.truckCategory) || getRelationSlug(product.truckCategory))
          .filter(Boolean),
      ),
    [activeProducts],
  );

  const availableTruckModelIds = useMemo(
    () =>
      new Set(
        activeProducts.flatMap((product) =>
          getModelRelations(product.truckModel)
            .map((model) => getRelationId(model) || getRelationSlug(model))
            .filter(Boolean),
        ),
      ),
    [activeProducts],
  );

  const availableBrands = useMemo(
    () =>
      brands.filter(
        (brand) => availableBrandIds.has(brand.id) || availableBrandIds.has(brand.slug),
      ),
    [availableBrandIds, brands],
  );

  const filterableBrands = useMemo(() => {
    const normalized = brandQuery.trim().toLowerCase();
    return availableBrands.filter(
      (brand) => !normalized || brand.name.toLowerCase().includes(normalized),
    );
  }, [availableBrands, brandQuery]);

  const availableCategories = useMemo(() => {
    const globallyAvailable = truckCategories.filter(
      (category) =>
        availableTruckCategoryIds.has(category.id) || availableTruckCategoryIds.has(category.slug),
    );

    if (!selectedBrands.length) return globallyAvailable;

    const categorySlugSet = new Set(
      truckModels
        .filter((model) => matchesSelected(selectedBrands, model.brand))
        .map((model) => getRelationSlug(model.truckCategory))
        .filter(Boolean),
    );

    return globallyAvailable.filter((category) => categorySlugSet.has(category.slug));
  }, [availableTruckCategoryIds, selectedBrands, truckCategories, truckModels]);

  const visibleCategories = useMemo(() => {
    const normalized = truckCategoryQuery.trim().toLowerCase();
    return availableCategories.filter(
      (category) => !normalized || category.name.toLowerCase().includes(normalized),
    );
  }, [availableCategories, truckCategoryQuery]);

  const availableProductCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          availableProductCategoryIds.has(category.id) || availableProductCategoryIds.has(category.slug),
      ),
    [availableProductCategoryIds, categories],
  );

  const visibleProductCategories = useMemo(() => {
    const normalized = productCategoryQuery.trim().toLowerCase();
    return availableProductCategories.filter(
      (category) => !normalized || category.name.toLowerCase().includes(normalized),
    );
  }, [availableProductCategories, productCategoryQuery]);

  const availableModels = useMemo(
    () =>
      truckModels.filter((model) => {
        const available = availableTruckModelIds.has(model.id) || availableTruckModelIds.has(model.slug);
        const matchesBrand = !selectedBrands.length || matchesSelected(selectedBrands, model.brand);
        const matchesTruckCategory =
          !selectedCategories.length || matchesSelected(selectedCategories, model.truckCategory);
        return available && matchesBrand && matchesTruckCategory;
      }),
    [availableTruckModelIds, selectedBrands, selectedCategories, truckModels],
  );

  const visibleModels = useMemo(() => {
    const normalized = modelQuery.trim().toLowerCase();
    return availableModels.filter((model) => {
      const matchesQuery = !normalized || model.name.toLowerCase().includes(normalized);
      return matchesQuery;
    });
  }, [availableModels, modelQuery]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activeProducts.filter((product) => {
      const matchesBrand = matchesSelectedMany(selectedBrands, product.brand);
      const matchesProductCategory = matchesSelected(selectedProductCategories, product.category);
      const matchesTruckCategory = matchesSelected(selectedCategories, product.truckCategory);
      const matchesModel =
        !selectedModels.length ||
        getModelRelations(product.truckModel).some((model) => matchesSelected(selectedModels, model));
      const matchesStock =
        !selectedStockStatuses.length ||
        (!!product.stockStatus && selectedStockStatuses.includes(product.stockStatus));
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.shortDescription, product.reference]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return (
        matchesBrand &&
        matchesProductCategory &&
        matchesTruckCategory &&
        matchesModel &&
        matchesStock &&
        matchesQuery
      );
    });
  }, [
    activeProducts,
    query,
    selectedBrands,
    selectedProductCategories,
    selectedCategories,
    selectedModels,
    selectedStockStatuses,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedBrands, selectedProductCategories, selectedCategories, selectedModels, selectedStockStatuses]);

  function resetFilters() {
    setQuery('');
    setSelectedBrands([]);
    setSelectedProductCategories([]);
    setSelectedCategories([]);
    setSelectedModels([]);
    setSelectedStockStatuses([]);
    setBrandQuery('');
    setProductCategoryQuery('');
    setTruckCategoryQuery('');
    setModelQuery('');
    setCurrentPage(1);
  }

  function toggleFiltersExpanded() {
    setOpenFilterPicker(null);
    setFiltersExpanded((current) => !current);
  }

  function openMobileFilters() {
    setOpenFilterPicker(null);
    setMobileFiltersOpen(true);
  }

  function closeMobileFilters() {
    setOpenFilterPicker(null);
    setMobileFiltersOpen(false);
  }

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedBrands.length > 0 ||
    selectedProductCategories.length > 0 ||
    selectedCategories.length > 0 ||
    selectedModels.length > 0 ||
    selectedStockStatuses.length > 0;

  const hasActiveSelectionFilters =
    selectedBrands.length > 0 ||
    selectedProductCategories.length > 0 ||
    selectedCategories.length > 0 ||
    selectedModels.length > 0 ||
    selectedStockStatuses.length > 0;

  const activeFilterTags = useMemo(() => {
    const tags: Array<{ key: string; label: string; onRemove: () => void }> = [];

    selectedBrands.forEach((value) => {
      const brand = brands.find((item) => item.slug === value || item.id === value);
      if (brand) {
        tags.push({
          key: `brand-${value}`,
          label: brand.name,
          onRemove: () => setSelectedBrands((current) => current.filter((item) => item !== value)),
        });
      }
    });

    selectedCategories.forEach((value) => {
      const category = truckCategories.find((item) => item.slug === value || item.id === value);
      if (category) {
        tags.push({
          key: `truck-category-${value}`,
          label: category.name,
          onRemove: () => setSelectedCategories((current) => current.filter((item) => item !== value)),
        });
      }
    });

    selectedProductCategories.forEach((value) => {
      const category = categories.find((item) => item.slug === value || item.id === value);
      if (category) {
        tags.push({
          key: `product-category-${value}`,
          label: category.name,
          onRemove: () =>
            setSelectedProductCategories((current) => current.filter((item) => item !== value)),
        });
      }
    });

    selectedModels.forEach((value) => {
      const model = truckModels.find((item) => item.slug === value || item.id === value);
      if (model) {
        tags.push({
          key: `model-${value}`,
          label: model.name,
          onRemove: () => setSelectedModels((current) => current.filter((item) => item !== value)),
        });
      }
    });

    selectedStockStatuses.forEach((value) => {
      const meta = stockMeta[value];
      if (meta) {
        tags.push({
          key: `stock-${value}`,
          label: meta.label,
          onRemove: () => setSelectedStockStatuses((current) => current.filter((item) => item !== value)),
        });
      }
    });

    return tags;
  }, [
    brands,
    categories,
    selectedBrands,
    selectedCategories,
    selectedModels,
    selectedProductCategories,
    selectedStockStatuses,
    truckCategories,
    truckModels,
  ]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const filtersContent = (
    <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.15fr] lg:items-start">
      <FilterPicker
        copy={copy}
        pickerKey="brands"
        openPicker={openFilterPicker}
        setOpenPicker={setOpenFilterPicker}
        title={copy.brands}
        placeholder={copy.select}
        options={filterableBrands}
        selectedValues={selectedBrands}
        searchValue={brandQuery}
        onSearchChange={setBrandQuery}
        onToggleValue={(value) => toggleValue(value, selectedBrands, setSelectedBrands)}
      />

      <FilterPicker
        copy={copy}
        pickerKey="truck-categories"
        openPicker={openFilterPicker}
        setOpenPicker={setOpenFilterPicker}
        title={copy.truckCategories}
        placeholder={copy.select}
        options={visibleCategories}
        selectedValues={selectedCategories}
        searchValue={truckCategoryQuery}
        onSearchChange={setTruckCategoryQuery}
        onToggleValue={(value) => toggleValue(value, selectedCategories, setSelectedCategories)}
      />

      <FilterPicker
        copy={copy}
        pickerKey="product-categories"
        openPicker={openFilterPicker}
        setOpenPicker={setOpenFilterPicker}
        title={copy.productCategories}
        placeholder={copy.select}
        options={visibleProductCategories}
        selectedValues={selectedProductCategories}
        searchValue={productCategoryQuery}
        onSearchChange={setProductCategoryQuery}
        onToggleValue={(value) =>
          toggleValue(value, selectedProductCategories, setSelectedProductCategories)
        }
      />

      <FilterPicker
        pickerKey="models"
        openPicker={openFilterPicker}
        setOpenPicker={setOpenFilterPicker}
        copy={copy}
        title={copy.truckModels}
        placeholder={copy.select}
        options={visibleModels}
        selectedValues={selectedModels}
        searchValue={modelQuery}
        onSearchChange={setModelQuery}
        onToggleValue={(value) => toggleValue(value, selectedModels, setSelectedModels)}
      />

      <div className="grid gap-3 rounded-sm border border-epct-ink/10 bg-[#fcfcfb] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-epct-ink/62">
{copy.availability}
        </p>
        <div className="grid gap-2 pt-1">
          {Object.entries(stockMeta).map(([value, meta]) => (
            <label key={value} className="flex min-h-9 items-center gap-3 text-sm text-epct-ink/78">
              <input
                type="checkbox"
                checked={selectedStockStatuses.includes(value)}
                onChange={() => toggleValue(value, selectedStockStatuses, setSelectedStockStatuses)}
                className="h-4 w-4 border-epct-ink/20 text-epct-green focus:ring-epct-green"
              />
              <span>{meta.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      {filtersExpanded || activeFilterTags.length ? (
        <section className="rounded-sm border border-epct-ink/10 bg-white px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {activeFilterTags.length ? (
                activeFilterTags.map((tag) => (
                  <button
                    key={tag.key}
                    type="button"
                    onClick={tag.onRemove}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-epct-green/18 bg-epct-green/8 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-epct-green transition hover:bg-epct-green/12"
                  >
                    <span className="max-w-[220px] truncate">{tag.label}</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                ))
              ) : filtersExpanded ? (
                <p className="text-sm text-epct-ink/55">{copy.noActiveFilters}</p>
              ) : null}
            </div>

            {hasActiveSelectionFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[#b42318] transition hover:bg-red-100"
                aria-label={copy.resetFilters}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="rounded-sm border border-epct-ink/10 bg-white p-5">
        <div className="grid gap-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-end">
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-epct-ink/62">
                {copy.search}
              </p>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-epct-ink/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="h-12 w-full rounded-sm border border-epct-ink/10 bg-[#fcfcfb] pl-10 pr-3 text-sm text-epct-dark outline-none transition placeholder:text-epct-ink/40 focus:border-epct-green"
                />
              </label>
            </div>

            <div className="hidden justify-end lg:flex">
              <button
                type="button"
                onClick={toggleFiltersExpanded}
                aria-expanded={filtersExpanded}
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-epct-ink/10 bg-[#fcfcfb] px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green/35 hover:text-epct-green"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>{filtersExpanded ? copy.hideFilters : copy.showFilters}</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${filtersExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={openMobileFilters}
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-epct-ink/10 bg-[#fcfcfb] px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green/35 hover:text-epct-green"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{copy.filters}</span>
              {hasActiveSelectionFilters ? (
                <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-epct-green px-1 text-[10px] font-bold text-white">
                  {activeFilterTags.length}
                </span>
              ) : null}
            </button>
          </div>

          <div
            className={`hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:grid ${
              filtersExpanded
                ? 'grid-rows-[1fr] overflow-visible opacity-100'
                : 'grid-rows-[0fr] overflow-hidden opacity-0'
            }`}
          >
            <div className="min-h-0">
              <div className="border-t border-epct-ink/10 pt-4">
                {filtersContent}
              </div>
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={closeMobileFilters}
            className="absolute inset-0 bg-black/35"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-[1.5rem] bg-white shadow-[0_-20px_50px_rgba(16,24,40,0.18)]">
            <div className="flex items-center justify-between border-b border-epct-ink/10 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-epct-green">
                  {copy.filters}
                </p>
                <p className="mt-1 text-sm text-epct-ink/62">{copy.refineMobile}</p>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveSelectionFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[#b42318]"
                    aria-label={copy.resetFilters}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closeMobileFilters}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-epct-ink/10 bg-white text-epct-dark"
                  aria-label={copy.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(82vh-4.75rem)] overflow-y-auto px-5 py-5">
              <div className="grid gap-4">{filtersContent}</div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid content-start gap-6 border border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8">
        {visibleProducts.length ? (
          <>
            <div className="hidden justify-end lg:flex">
              <div className="inline-flex items-center overflow-hidden rounded-sm border border-epct-ink/10 bg-white">
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold transition ${
                    viewMode === 'kanban'
                      ? 'bg-epct-green text-white'
                      : 'text-epct-dark hover:bg-[#f8f8f6]'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  {copy.kanban}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`inline-flex h-10 items-center gap-2 border-l border-epct-ink/10 px-4 text-sm font-semibold transition ${
                    viewMode === 'list'
                      ? 'bg-epct-green text-white'
                      : 'text-epct-dark hover:bg-[#f8f8f6]'
                  }`}
                >
                  <List className="h-4 w-4" />
                  {copy.list}
                </button>
              </div>
            </div>

            {viewMode === 'kanban' ? (
              <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => {
                  const firstImage = product.images?.[0];
                  const imageUrl = getMediaUrl(firstImage?.image) || '/img/no_image.svg';
                  const stock = product.stockStatus ? stockMeta[product.stockStatus] : null;

                  return (
                    <article
                      key={product.id}
                      className="self-start overflow-hidden border border-epct-ink/10 bg-white shadow-[0_10px_24px_rgba(16,24,40,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(16,24,40,0.10)]"
                    >
                      <Link
                        href={`/catalogue/${product.slug}`}
                        className="relative block aspect-[16/8] overflow-hidden bg-neutral-100"
                      >
                        <ProtectedImage
                          src={imageUrl}
                          alt={firstImage?.alt || product.name}
                          width={1200}
                          height={900}
                          className="h-full w-full object-cover"
                          sizes="(min-width: 1280px) 24vw, (min-width: 640px) 45vw, 100vw"
                        />
                        {stock ? (
                          <span
                            className={`absolute left-4 top-4 inline-flex min-h-8 items-center px-3 text-[10px] font-bold uppercase tracking-[0.08em] ${stock.className}`}
                          >
                            {stock.label}
                          </span>
                        ) : null}
                      </Link>

                      <div className="grid gap-2 px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {getRelationArray(product.brand).map((brand, index) => {
                            const label = typeof brand === 'string' ? brand : brand.name;
                            const badgeColor =
                              typeof brand === 'string' ? null : (brand as PublicBrand).badgeColor || null;

                            return (
                              <span
                                key={`brand-${typeof brand === 'string' ? `${index}-${brand}` : brand.id || brand.slug || index}`}
                                className={`inline-flex min-h-7 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                                  badgeColor ? '' : 'bg-epct-green/10 text-epct-green'
                                }`}
                                style={badgeColor ? { backgroundColor: badgeColor, color: '#ffffff' } : undefined}
                              >
                                {label}
                              </span>
                            );
                          })}
                          {typeof product.truckCategory !== 'string' && product.truckCategory ? (
                            <span className="inline-flex min-h-7 items-center rounded-full bg-neutral-100 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-epct-ink/65">
                              {product.truckCategory.name}
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <h2 className="font-display text-xl uppercase leading-tight text-epct-dark">
                            <Link href={`/catalogue/${product.slug}`} className="transition hover:text-epct-green">
                              {product.name}
                            </Link>
                          </h2>
                        </div>

                        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-epct-green/85">
                          {copy.ref} {product.reference}
                        </p>

                        <p className="text-sm leading-6 text-epct-ink/72">
                          {truncateText(product.shortDescription, 50)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="-mx-5 overflow-hidden border-y border-epct-ink/10 bg-white md:-mx-8">
                <div className="hidden grid-cols-[140px_1.4fr_0.9fr_1.1fr_1.05fr_0.95fr] gap-4 border-b border-epct-ink/10 bg-[#f8f8f6] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/58 lg:grid">
                  <span>{copy.image}</span>
                  <span>{copy.title}</span>
                  <span>{copy.reference}</span>
                  <span>{copy.brand}</span>
                  <span>{copy.truckCategory}</span>
                  <span>{copy.availability}</span>
                </div>

                <div className="grid">
                  {paginatedProducts.map((product) => {
                    const firstImage = product.images?.[0];
                    const imageUrl = getMediaUrl(firstImage?.image) || '/img/no_image.svg';
                    const stock = product.stockStatus ? stockMeta[product.stockStatus] : null;
                    const brandLabels = getRelationArray(product.brand).map((brand) =>
                      typeof brand === 'string' ? brand : brand.name,
                    );
                    const truckCategoryLabel =
                      typeof product.truckCategory === 'string'
                        ? product.truckCategory
                        : product.truckCategory?.name || '-';

                    return (
                      <Link
                        key={product.id}
                        href={`/catalogue/${product.slug}`}
                        className="grid gap-4 border-b border-epct-ink/10 px-4 py-4 transition hover:bg-[#fcfcfb] last:border-b-0 lg:grid-cols-[140px_1.4fr_0.9fr_1.1fr_1.05fr_0.95fr] lg:items-center lg:px-5"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                          <ProtectedImage
                            src={imageUrl}
                            alt={firstImage?.alt || product.name}
                            width={800}
                            height={600}
                            className="h-full w-full object-cover"
                            sizes="140px"
                          />
                        </div>

                        <div className="grid gap-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/48 lg:hidden">
                            {copy.title}
                          </p>
                          <p className="font-display text-lg uppercase leading-tight text-epct-dark">
                            {product.name}
                          </p>
                        </div>

                        <div className="grid gap-1 text-sm text-epct-ink/75">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/48 lg:hidden">
                            {copy.reference}
                          </p>
                          <p className="font-semibold uppercase tracking-[0.08em] text-epct-green/85">
                          {copy.ref} {product.reference}
                          </p>
                        </div>

                        <div className="grid gap-1 text-sm text-epct-ink/75">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/48 lg:hidden">
                            {copy.brand}
                          </p>
                          <p>{brandLabels.length ? brandLabels.join(', ') : '-'}</p>
                        </div>

                        <div className="grid gap-1 text-sm text-epct-ink/75">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/48 lg:hidden">
                            {copy.truckCategory}
                          </p>
                          <p>{truckCategoryLabel}</p>
                        </div>

                        <div className="grid gap-1 text-sm text-epct-ink/75">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/48 lg:hidden">
                            {copy.availability}
                          </p>
                          {stock ? (
                            <span
                              className={`inline-flex min-h-8 w-fit items-center px-3 text-[10px] font-bold uppercase tracking-[0.08em] ${stock.className}`}
                            >
                              {stock.label}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex min-h-10 items-center justify-center border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:bg-[#f8f8f6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.previous}
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-semibold transition ${
                    currentPage === page
                      ? 'border-epct-green bg-epct-green text-white'
                      : 'border-epct-ink/10 bg-white text-epct-dark hover:bg-[#f8f8f6]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex min-h-10 items-center justify-center border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:bg-[#f8f8f6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.next}
              </button>
            </div>
          </>
        ) : (
          <div className="border border-dashed border-epct-green/35 bg-white px-6 py-14 text-center text-epct-ink/70">
            {copy.noProducts}
          </div>
        )}
      </section>
    </div>
  );
}
