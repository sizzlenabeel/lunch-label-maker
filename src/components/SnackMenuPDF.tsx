import React from 'react';
import { Document, Page, View, Text, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';

interface SnackMenuProps {
  weekNumber: number;
  veganOnly: boolean;
  fontSize: 'normal' | 'small' | 'smaller';
}

interface SnackMenuItem {
  original: {
    name: string;
    description: string;
    allergens: string;
    price?: number | null;
  };
  english?: {
    name: string;
    description: string;
    allergens: string;
    price?: number | null;
  };
  isVegan: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: '40 11.34',
    backgroundColor: 'white',
    fontFamily: 'SF Pro',
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyNameSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  companyNameSmaller: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  weekInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
    color: '#666666',
  },
  weekInfoSmall: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
    color: '#666666',
  },
  weekInfoSmaller: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 3,
    color: '#666666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7.0875,
    color: '#d97706', // amber-600
  },
  titleSmall: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7.0875,
    color: '#d97706',
  },
  titleSmaller: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7.0875,
    color: '#d97706',
  },
  menuItem: {
    marginBottom: 10.375,
  },
  menuItemSmall: {
    marginBottom: 7.875,
  },
  menuItemSmaller: {
    marginBottom: 5.375,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  itemNameSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  itemNameSmaller: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  descriptionSmall: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  descriptionSmaller: {
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  allergens: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  allergensSmall: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  allergensSmaller: {
    fontSize: 7,
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  veganBadge: {
    fontSize: 9,
    color: '#059669',
    marginTop: 4,
  },
  veganBadgeSmall: {
    fontSize: 8,
    color: '#059669',
    marginTop: 3,
  },
  veganBadgeSmaller: {
    fontSize: 7,
    color: '#059669',
    marginTop: 2,
  },
  noTranslation: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  noTranslationSmall: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  noTranslationSmaller: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 0,
  },
  column: {
    flex: 1,
    maxWidth: '45%',
  },
});

export function SnackMenuPDF({ weekNumber, veganOnly, fontSize }: SnackMenuProps) {
  const [menuItems, setMenuItems] = React.useState<SnackMenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadFonts = async () => {
      await Font.register({
        family: 'SF Pro',
        src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff',
        fontWeight: 'normal'
      });
      await Font.register({
        family: 'SF Pro',
        src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYBOLD.woff',
        fontWeight: 'bold'
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const getStyle = (baseStyle: string) => {
    const styleMap = {
      normal: styles[baseStyle as keyof typeof styles],
      small: styles[`${baseStyle}Small` as keyof typeof styles] || styles[baseStyle as keyof typeof styles],
      smaller: styles[`${baseStyle}Smaller` as keyof typeof styles] || styles[baseStyle as keyof typeof styles]
    };
    return styleMap[fontSize];
  };

  React.useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('products')
          .select(`
            name,
            description,
            allergens,
            price,
            is_vegan,
            translated_name,
            translated_description,
            translated_allergens
          `)
          .eq('week_number', weekNumber)
          .eq('is_snack', true);

        if (veganOnly) {
          query = query.eq('is_vegan', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        const items: SnackMenuItem[] = (data || []).map((product) => ({
          original: {
            name: product.name,
            description: product.description,
            allergens: product.allergens,
            price: product.price,
          },
          english: product.translated_name ? {
            name: product.translated_name,
            description: product.translated_description,
            allergens: product.translated_allergens,
            price: product.price,
          } : undefined,
          isVegan: product.is_vegan,
        }));

        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching snack menu items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, [weekNumber, veganOnly]);

  if (loading || !fontsLoaded) {
    return <div>Loading snack menu...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const MenuItemComponent = ({ item, isEnglish = false }: { item: SnackMenuItem; isEnglish?: boolean }) => {
    const content = isEnglish ? item.english : item.original;

    if (isEnglish && !content) {
      return (
        <View style={getStyle('menuItem')}>
          <Text style={getStyle('noTranslation')}>Translation not available</Text>
        </View>
      );
    }

    if (!content) return null;

    return (
      <View style={getStyle('menuItem')}>
        <Text style={getStyle('itemName')}>
          {content.name}{content.price ? ` ${content.price} kr` : ''}
        </Text>
        <Text style={getStyle('description')}>{content.description}</Text>
        <Text style={getStyle('allergens')}>Allergens: {content.allergens}</Text>
        {item.isVegan && (
          <Text style={getStyle('veganBadge')}>Vegan</Text>
        )}
      </View>
    );
  };

  return (
    <PDFViewer width="100%" height="800px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={getStyle('companyName')}>Sizzle x Wester & Wester</Text>
            <Text style={getStyle('weekInfo')}>Week {weekNumber}</Text>
            <Text style={getStyle('title')}>
              {veganOnly ? 'Vegan Snacks' : 'Snack Menu'}
            </Text>
          </View>

          <View style={styles.columnsContainer}>
            <View style={styles.column}>
              {menuItems.map((item, index) => (
                <MenuItemComponent 
                  key={`original-${index}`} 
                  item={item}
                />
              ))}
            </View>

            <View style={styles.column}>
              {menuItems.map((item, index) => (
                <MenuItemComponent 
                  key={`english-${index}`} 
                  item={item} 
                  isEnglish={true}
                />
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}