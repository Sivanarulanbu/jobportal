/**
 * Professional Job Portal Color Theme
 * Blue + White + Gray
 * Clean, corporate, trustworthy — inspired by LinkedIn & Indeed
 */

export const COLORS = {
  // Primary Colors
  PRIMARY: '#0A66C2',        // Deep blue – main CTA, nav highlights
  PRIMARY_HOVER: '#0857A5',  // Slightly darker blue
  PRIMARY_LIGHT: '#E6F1FC',  // Very light blue background

  // Highlight Color
  HIGHLIGHT: '#2563EB',       // Bright blue for actions and active states
  HIGHLIGHT_HOVER: '#1E4FC5', // Darker highlight
  HIGHLIGHT_LIGHT: '#E9F0FF', // Soft highlight background

  // Secondary Colors (White-based theme)
  SECONDARY: '#FFFFFF',       // Pure white – cards, sections, navbar
  SECONDARY_LIGHT: '#F8FAFC', // Extra soft white
  SECONDARY_DARK: '#F1F5F9',  // Slightly darker white for subtle contrast

  // Accent Color (Neutral Gray)
  ACCENT: '#F3F4F6',          // Light gray backgrounds
  ACCENT_DARK: '#E5E7EB',     // Darker gray for box borders
  ACCENT_LIGHT: '#FAFBFC',    // Very soft gray for surfaces

  // Background Colors
  BG_PRIMARY: '#FFFFFF',      // Main page content
  BG_SECONDARY: '#F3F4F6',    // Light gray sections
  BG_TERTIARY: '#E5E7EB',     // Subtle secondary blocks

  // Text Colors
  TEXT_PRIMARY: '#1E293B',    // Dark blue-gray for headlines
  TEXT_SECONDARY: '#475569',  // Medium slate gray
  TEXT_MUTED: '#94A3B8',      // Light gray for descriptions
  TEXT_WHITE: '#FFFFFF',      // White on dark backgrounds

  // Status Colors (subtle + professional)
  SUCCESS: '#15803D',
  SUCCESS_LIGHT: '#E9F7EE',

  ERROR: '#B91C1C',
  ERROR_LIGHT: '#FEECEC',

  WARNING: '#D97706',
  WARNING_LIGHT: '#FFF7E6',

  INFO: '#2563EB',
  INFO_LIGHT: '#EAF2FF',

  // Neutral UI Elements
  BORDER: '#D1D5DB',
  DISABLED: '#9CA3AF',
  DIVIDER: '#E2E8F0',

  // Shadows
  SHADOW: 'rgba(0, 0, 0, 0.08)',

  // Gradients (professional & subtle)
  GRADIENT_PRIMARY: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 100%)',
  GRADIENT_ACCENT: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  GRADIENT_INFO: 'linear-gradient(135deg, #2563EB 0%, #1E4FC5 100%)',
};

/**
 * Tailwind CSS gradient mapping
 * Matches the Blue + Gray theme visually
 */
export const TAILWIND_COLORS = {
  primary: 'from-blue-600 to-blue-700',       // Deep + Bright Blue
  highlight: 'from-blue-500 to-blue-600',     // Vibrant highlight
  accent: 'from-gray-200 to-gray-300',        // Light gray gradients
  success: 'from-green-600 to-green-700',
  error: 'from-red-600 to-red-700',
  warning: 'from-yellow-500 to-yellow-600',
  info: 'from-blue-500 to-blue-700',
};

/**
 * Usage Examples:
 *
 * JavaScript (Inline styles):
 * <button style={{ backgroundColor: COLORS.PRIMARY }}>
 *
 * Tailwind CSS:
 * className="bg-blue-600 hover:bg-blue-700 text-white"
 * className={`bg-gradient-to-r ${TAILWIND_COLORS.primary}`}
 */
