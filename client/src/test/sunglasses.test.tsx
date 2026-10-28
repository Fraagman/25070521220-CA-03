import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../components/ProductCard';
import { SunglassesSVG } from '../components/SunglassesSVG';
import { CartDrawer } from '../components/CartDrawer';
import type { Sunglasses, CartItem } from '../types';

const mockProduct: Sunglasses = {
  _id: 'prod-001',
  name: 'EXSANGUINATOR 3000',
  slug: 'exsanguinator-3000',
  tagline: 'Aerodynamic cyber-shield forged in arterial crimson.',
  category: 'Cyber-Visor',
  price: 189.99,
  originalPrice: 229.99,
  inStock: 12,
  splatterLevel: 'Catastrophic',
  rating: 4.9,
  reviewCount: 38,
  description: 'Engineered from ballistic polycarbonate and titanium skeletal struts.',
  frameMaterial: 'Surgical Titanium Skeleton',
  lensSpecs: 'Arterial Red Mirrored Shield, Polarized UV400',
  dimensions: {
    lensWidth: 142,
    bridge: 0,
    temple: 135,
    weightGrams: 42,
  },
  features: ['Monolithic 180 field', 'ANSI Z87.1 certified'],
  badge: 'BESTSELLER',
  svgVariant: 'visor',
  reviews: [
    {
      id: 'rev-1',
      author: 'Vesper_Gore',
      rating: 5,
      comment: 'Pure blood-red optical perfection.',
      date: '2026-09-14',
      verifiedGore: true,
    },
  ],
};

describe('CARNAGE OPTIX Frontend Test Suite', () => {
  it('renders ProductCard with product details and splatter level badge', () => {
    const onAddToCart = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
      />
    );

    expect(screen.getByText('EXSANGUINATOR 3000')).toBeInTheDocument();
    expect(screen.getByText('$189.99')).toBeInTheDocument();
    expect(screen.getByText('Cyber-Visor')).toBeInTheDocument();
    expect(screen.getByText('Catastrophic')).toBeInTheDocument();
    expect(screen.getByText('BESTSELLER')).toBeInTheDocument();
    expect(screen.getByText('12 IN STOCK')).toBeInTheDocument();
  });

  it('triggers onAddToCart callback when Claim in Bag button clicked', () => {
    const onAddToCart = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
      />
    );

    const claimButton = screen.getByTestId(`add-to-cart-${mockProduct._id}`);
    fireEvent.click(claimButton);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('renders SunglassesSVG for different variants without crashing', () => {
    const { container: visorContainer } = render(<SunglassesSVG variant="visor" />);
    expect(visorContainer.querySelector('svg')).toBeInTheDocument();

    const { container: polyContainer } = render(<SunglassesSVG variant="polygonal" />);
    expect(polyContainer.querySelector('svg')).toBeInTheDocument();

    const { container: aviatorContainer } = render(<SunglassesSVG variant="aviator" />);
    expect(aviatorContainer.querySelector('svg')).toBeInTheDocument();
  });

  it('calculates cart totals and applies GORE10 promo code', () => {
    const cart: CartItem[] = [
      {
        product: mockProduct,
        quantity: 1, // 189.99 >= 150 -> free shipping
      },
    ];

    const onUpdateQuantity = vi.fn();
    const onRemoveItem = vi.fn();
    const onProceedToCheckout = vi.fn();
    const setAppliedPromo = vi.fn();

    render(
      <CartDrawer
        isOpen={true}
        onClose={vi.fn()}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onProceedToCheckout={onProceedToCheckout}
        appliedPromo="GORE10"
        setAppliedPromo={setAppliedPromo}
      />
    );

    expect(screen.getByText('EXSANGUINATOR 3000')).toBeInTheDocument();
    expect(screen.getByText('PROMO APPLIED: GORE10')).toBeInTheDocument();
    expect(screen.getByText('FREE OVER $150')).toBeInTheDocument();
    // 189.99 - 10% (19.00) = $170.99
    expect(screen.getByText('$170.99')).toBeInTheDocument();
  });
});

