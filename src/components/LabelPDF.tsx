import { Document, Page, View, Text, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import type { FoodLabel } from '../types';
import { format } from 'date-fns';

// Register fonts once
Font.register({
  family: 'SF Pro',
  src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff',
});
Font.register({
  family: 'SF Pro Bold',
  src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYBOLD.woff',
});

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// Convert cm to points (1 cm = 28.35 points)
const cmToPoints = (cm: number) => cm * 28.35;

// Margins and spacing
const MARGIN_TOP_BOTTOM = cmToPoints(1.2);
const MARGIN_LEFT_RIGHT = cmToPoints(0.6);
const COLUMN_SPACING = cmToPoints(0.3);

// Calculate label dimensions
const USABLE_WIDTH = A4_WIDTH - (2 * MARGIN_LEFT_RIGHT);
const LABEL_WIDTH = (USABLE_WIDTH - COLUMN_SPACING) / 2;
const USABLE_HEIGHT = A4_HEIGHT - (2 * MARGIN_TOP_BOTTOM);
const LABEL_HEIGHT = USABLE_HEIGHT / 8;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: `${MARGIN_TOP_BOTTOM}pt ${MARGIN_LEFT_RIGHT}pt`,
    gap: `${COLUMN_SPACING}pt`,
    fontFamily: 'SF Pro',
  },
  column: {
    flex: 1,
    gap: 0,
  },
  label: {
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    padding: `${cmToPoints(0.2)}pt 10pt 10pt 10pt`,
    border: '1pt solid black',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8
  },
  name: {
    fontSize: 11,
    fontFamily: 'SF Pro Bold',
    marginBottom: 4,
    flex: 1,
  },
  text: {
    fontSize: 8,
    marginBottom: 2,
  },
  textSmall: {
    fontSize: 7,
    marginBottom: 2,
  },
  textSmaller: {
    fontSize: 6,
    marginBottom: 2,
  },
  allergens: {
    fontSize: 8,
    fontFamily: 'SF Pro Bold',
  },
  allergensSmall: {
    fontSize: 7,
    fontFamily: 'SF Pro Bold',
  },
  allergensSmaller: {
    fontSize: 6,
    fontFamily: 'SF Pro Bold',
  },
  allergensRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 8,
    fontFamily: 'SF Pro Bold',
  },
  priceSmall: {
    fontSize: 7,
    fontFamily: 'SF Pro Bold',
  },
  priceSmaller: {
    fontSize: 6,
    fontFamily: 'SF Pro Bold',
  },
  veganIcon: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    fontSize: 8,
    color: '#059669',
    fontFamily: 'SF Pro',
  },
});

interface LabelPDFProps {
  data: FoodLabel;
}

export function LabelPDF({ data }: LabelPDFProps) {
  const formattedDate = format(new Date(data.dueDate), 'yyyy-MM-dd');
  
  // Create arrays for left and right columns
  const leftColumn = Array(8).fill(null);
  const rightColumn = Array(8).fill(null);

  const LabelContent = () => {
    const getTextStyle = () => {
      switch (data.fontSize) {
        case 'small':
          return styles.textSmall;
        case 'smaller':
          return styles.textSmaller;
        default:
          return styles.text;
      }
    };

    const getAllergensStyle = () => {
      switch (data.fontSize) {
        case 'small':
          return styles.allergensSmall;
        case 'smaller':
          return styles.allergensSmaller;
        default:
          return styles.allergens;
      }
    };

    return (
      <View style={styles.label}>
        <View style={styles.header}>
          <Text style={styles.name} wrap={true}>{data.name}</Text>
          <Text style={[getTextStyle(), { minWidth: 80 }]}>Best före: {formattedDate}</Text>
        </View>
        <Text style={getTextStyle()}>Ingredienser: {data.ingredients}</Text>
        <View style={styles.allergensRow}>
          <Text style={getAllergensStyle()}>Allergener: {data.allergens}</Text>
        </View>
        <Text style={getTextStyle()}>{data.consumptionGuidelines}</Text>
        <Text style={getTextStyle()}>{data.description}</Text>
        {data.isVegan && (
          <Text style={styles.veganIcon}>Vegan</Text>
        )}
      </View>
    );
  };

  return (
    <PDFViewer width="100%" height="800px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.column}>
            {leftColumn.map((_, index) => (
              <LabelContent key={`left-${index}`} />
            ))}
          </View>
          <View style={styles.column}>
            {rightColumn.map((_, index) => (
              <LabelContent key={`right-${index}`} />
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}