import React from 'react';
import { Document, Page, View, Text, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';

// Register fonts at module level (same pattern as StorytelLabelPDF)
Font.register({
  family: 'SF Pro',
  src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff',
});
Font.register({
  family: 'SF Pro Bold',
  src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYBOLD.woff',
});

interface StorytelMenuProps {
  weekNumber: number;
  fontSize: 'normal' | 'small' | 'smaller';
}

interface StorytelMenuItem {
  name: string;
  description: string;
  allergens: string;
  isVegan: boolean;
  deliveryDay: string;
}

const styles = StyleSheet.create({
  page: {
    padding: '40 20',
    backgroundColor: 'white',
    fontFamily: 'SF Pro',
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'SF Pro Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyNameSmall: {
    fontSize: 16,
    fontFamily: 'SF Pro Bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  companyNameSmaller: {
    fontSize: 14,
    fontFamily: 'SF Pro Bold',
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
    fontFamily: 'SF Pro Bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#7c3aed',
  },
  titleSmall: {
    fontSize: 20,
    fontFamily: 'SF Pro Bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#7c3aed',
  },
  titleSmaller: {
    fontSize: 16,
    fontFamily: 'SF Pro Bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#7c3aed',
  },
  daySection: {
    marginBottom: 20,
  },
  daySectionSmall: {
    marginBottom: 16,
  },
  daySectionSmaller: {
    marginBottom: 12,
  },
  dayHeader: {
    fontSize: 16,
    fontFamily: 'SF Pro Bold',
    marginBottom: 12,
    color: '#1a1a1a',
    borderBottom: '2pt solid #7c3aed',
    paddingBottom: 4,
  },
  dayHeaderSmall: {
    fontSize: 14,
    fontFamily: 'SF Pro Bold',
    marginBottom: 10,
    color: '#1a1a1a',
    borderBottom: '2pt solid #7c3aed',
    paddingBottom: 3,
  },
  dayHeaderSmaller: {
    fontSize: 12,
    fontFamily: 'SF Pro Bold',
    marginBottom: 8,
    color: '#1a1a1a',
    borderBottom: '2pt solid #7c3aed',
    paddingBottom: 2,
  },
  menuItem: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  menuItemSmall: {
    marginBottom: 10,
    paddingLeft: 8,
  },
  menuItemSmaller: {
    marginBottom: 8,
    paddingLeft: 6,
  },
  itemName: {
    fontSize: 13,
    fontFamily: 'SF Pro Bold',
    marginBottom: 4,
  },
  itemNameSmall: {
    fontSize: 11,
    fontFamily: 'SF Pro Bold',
    marginBottom: 3,
  },
  itemNameSmaller: {
    fontSize: 9,
    fontFamily: 'SF Pro Bold',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  descriptionSmall: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 3,
  },
  descriptionSmaller: {
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 2,
  },
  allergens: {
    fontSize: 10,
    color: '#dc2626',
    fontFamily: 'SF Pro Bold',
    marginBottom: 2,
  },
  allergensSmall: {
    fontSize: 8,
    color: '#dc2626',
    fontFamily: 'SF Pro Bold',
    marginBottom: 2,
  },
  allergensSmaller: {
    fontSize: 7,
    color: '#dc2626',
    fontFamily: 'SF Pro Bold',
    marginBottom: 1,
  },
  veganBadge: {
    fontSize: 9,
    color: '#059669',
    marginTop: 2,
  },
  veganBadgeSmall: {
    fontSize: 8,
    color: '#059669',
    marginTop: 2,
  },
  veganBadgeSmaller: {
    fontSize: 7,
    color: '#059669',
    marginTop: 1,
  },
  noDishes: {
    fontSize: 10,
    color: '#6b7280',
    paddingLeft: 10,
  },
  noDishesSmall: {
    fontSize: 9,
    color: '#6b7280',
    paddingLeft: 8,
  },
  noDishesSmaller: {
    fontSize: 8,
    color: '#6b7280',
    paddingLeft: 6,
  },
});

export function StorytelMenuPDF({ weekNumber, fontSize }: StorytelMenuProps) {
  const [menuItems, setMenuItems] = React.useState<StorytelMenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      console.log(`[StorytelMenuPDF] Fetching items for week ${weekNumber}...`);
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            translated_name,
            translated_description,
            translated_allergens,
            is_vegan,
            delivery_day,
            is_snack
          `)
          .eq('week_number', weekNumber)
          .or('is_for_storytel.eq.true,is_only_for_storytel.eq.true')
          .or('is_snack.eq.false,is_snack.is.null')
          .not('delivery_day', 'is', null);

        if (error) throw error;

        console.log(`[StorytelMenuPDF] Raw data for week ${weekNumber}:`, data);

        const items: StorytelMenuItem[] = (data || [])
          .filter(product => product.translated_name)
          .map((product) => ({
            name: product.translated_name || '',
            description: product.translated_description || '',
            allergens: product.translated_allergens || '',
            isVegan: product.is_vegan || false,
            deliveryDay: product.delivery_day || '',
          }));

        console.log(`[StorytelMenuPDF] Processed ${items.length} items for week ${weekNumber}`);
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching Storytel menu items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, [weekNumber]);

  if (loading) {
    return <div className="p-4 text-center">Loading Storytel menu...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const itemsByDay = days.reduce((acc, day) => {
    acc[day] = menuItems.filter(item => item.deliveryDay === day);
    return acc;
  }, {} as Record<string, StorytelMenuItem[]>);

  return (
    <PDFViewer width="100%" height="800px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={getStyle('companyName')}>Sizzle</Text>
            <Text style={getStyle('weekInfo')}>Week {weekNumber}</Text>
            <Text style={getStyle('title')}>Storytel Weekly Menu</Text>
          </View>

          {days.map((day) => (
            <View key={day} style={getStyle('daySection')}>
              <Text style={getStyle('dayHeader')}>{day}</Text>
              {itemsByDay[day].length > 0 ? (
                itemsByDay[day].map((item, index) => (
                  <View key={`${day}-${index}`} style={getStyle('menuItem')}>
                    <Text style={getStyle('itemName')}>{item.name}</Text>
                    <Text style={getStyle('description')}>{item.description}</Text>
                    <Text style={getStyle('allergens')}>Allergens: {item.allergens}</Text>
                    {item.isVegan && (
                      <Text style={getStyle('veganBadge')}>Vegan</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={getStyle('noDishes')}>No dishes scheduled</Text>
              )}
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
  );
}
