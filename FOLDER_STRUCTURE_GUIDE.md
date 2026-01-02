# Tourist Spot Folder Structure Guide

This document contains the complete folder structure for all tourist spots in Catanduanes (excluding Virac municipality).

## Overview
- **Total Folders**: 76 tourist spot folders
- **Municipalities**: 10 (BATO, BARAS, SAN_MIGUEL, BAGAMANOC, VIGA, PANGANIBAN, PANDAN, CARAMORAN, GIGMOTO, SAN_ANDRES)
- **Base Path**: `src/assets/{MUNICIPALITY}/{SPOT_NAME}/`

## How to Create Folders

You can create these folders using your preferred method:

### Option 1: Using Terminal (Recommended for bulk creation)
```bash
# Navigate to your project root
cd Pathfinder-new

# Create all folders at once (copy and paste this entire block)
mkdir -p "src/assets/BAGAMANOC/Bagamanoc_Guest_House"
mkdir -p "src/assets/BAGAMANOC/Boto_Ni_Korakog_(Fertility_Island)"
mkdir -p "src/assets/BAGAMANOC/Costa_Marina"
mkdir -p "src/assets/BAGAMANOC/Dayhagan_Beach_Resort"
mkdir -p "src/assets/BAGAMANOC/E-Lounge_Resto_Bar"
mkdir -p "src/assets/BAGAMANOC/Emmans_Eatery"
mkdir -p "src/assets/BAGAMANOC/Paday_Falls"
mkdir -p "src/assets/BAGAMANOC/Palestina_Rolling_Hills"
mkdir -p "src/assets/BAGAMANOC/Villa_Felina"

mkdir -p "src/assets/BARAS/2838_Tea_and_Cafe"
mkdir -p "src/assets/BARAS/Abihao_Point"
mkdir -p "src/assets/BARAS/Alon_Stay"
mkdir -p "src/assets/BARAS/Balacay_Point"
mkdir -p "src/assets/BARAS/Binurong_Point"
mkdir -p "src/assets/BARAS/Dela_Villas_Balacay_Inn"
mkdir -p "src/assets/BARAS/East_Coast_Beach_Resort"
mkdir -p "src/assets/BARAS/Jo_Surf_Inn"
mkdir -p "src/assets/BARAS/LAstrolabe"
mkdir -p "src/assets/BARAS/Macutal_Falls"
mkdir -p "src/assets/BARAS/Majestic_Puraran_Beach_Resort"
mkdir -p "src/assets/BARAS/Nyxx_and_Match_Café"
mkdir -p "src/assets/BARAS/Puraran_Surf_Resort"
mkdir -p "src/assets/BARAS/Stanza_De_Benedicto"
mkdir -p "src/assets/BARAS/TasTea"
mkdir -p "src/assets/BARAS/Titaay_Surfers_Inn"

mkdir -p "src/assets/BATO/Balongbong_Falls"
mkdir -p "src/assets/BATO/Batalay_Mangrove_Eco_Park"
mkdir -p "src/assets/BATO/Bitaogan_Beach"
mkdir -p "src/assets/BATO/Bote_Lighthouse"
mkdir -p "src/assets/BATO/Cagraray_Island"
mkdir -p "src/assets/BATO/Carorian_Wonders"
mkdir -p "src/assets/BATO/Diocesan_Shrine_of_the_Holy_Cross"
mkdir -p "src/assets/BATO/Kapet_Tagpuan_Sa_Isla"
mkdir -p "src/assets/BATO/Little_Bliss_Cafe"
mkdir -p "src/assets/BATO/Maribina_Falls"
mkdir -p "src/assets/BATO/Mount_Pinagkaayonan_(Lantad)"
mkdir -p "src/assets/BATO/Poseidon_Cove_Beach_Resort"
mkdir -p "src/assets/BATO/Sakahon_Beach"
mkdir -p "src/assets/BATO/St._Anthony_of_Padua_Parish_Church"
mkdir -p "src/assets/BATO/St._John_the_Baptist_Church"
mkdir -p "src/assets/BATO/Villa_Andrea_Inn"

mkdir -p "src/assets/CARAMORAN/Caramoran_Beach_Resort"
mkdir -p "src/assets/CARAMORAN/Guinobatan_Falls"
mkdir -p "src/assets/CARAMORAN/Mamangal_Beach"
mkdir -p "src/assets/CARAMORAN/San_Isidro_Labrador_Church"

mkdir -p "src/assets/GIGMOTO/Gigmoto_Island_Resort"
mkdir -p "src/assets/GIGMOTO/Gigmoto_Lighthouse"
mkdir -p "src/assets/GIGMOTO/Solong_Beach"

mkdir -p "src/assets/PANDAN/Cabugao_Gamay_Island"
mkdir -p "src/assets/PANDAN/Immaculate_Conception_Parish_Church"
mkdir -p "src/assets/PANDAN/Pandan_Beach_Resort"

mkdir -p "src/assets/PANGANIBAN/Panganiban_Beach"
mkdir -p "src/assets/PANGANIBAN/Panganiban_Church"
mkdir -p "src/assets/PANGANIBAN/Tuwad-Tuwadan_Lagoon"

mkdir -p "src/assets/SAN_ANDRES/Nahulugan_Falls"
mkdir -p "src/assets/SAN_ANDRES/San_Andres_Beach"
mkdir -p "src/assets/SAN_ANDRES/San_Andres_Church"

mkdir -p "src/assets/SAN_MIGUEL/San_Miguel_Beach"
mkdir -p "src/assets/SAN_MIGUEL/San_Miguel_Church"

mkdir -p "src/assets/VIGA/Black_Alley"
mkdir -p "src/assets/VIGA/Cathys_Spring_Resort"
mkdir -p "src/assets/VIGA/Cogon_Hills"
mkdir -p "src/assets/VIGA/Emerich_Inn"
mkdir -p "src/assets/VIGA/H20_Resort"
mkdir -p "src/assets/VIGA/Isla_Bistro_Café"
mkdir -p "src/assets/VIGA/Jacs_Eatery"
mkdir -p "src/assets/VIGA/Kubo_Suzara"
mkdir -p "src/assets/VIGA/Manuria_Beach_Resort"
mkdir -p "src/assets/VIGA/Minaabat_Beach"
mkdir -p "src/assets/VIGA/Our_Lady_of_Mount_Carmel_Parish_Church"
mkdir -p "src/assets/VIGA/Our_Lady_of_the_Assumption_Parish_Church"
mkdir -p "src/assets/VIGA/Sofeca_Travellers_Inn"
mkdir -p "src/assets/VIGA/Summit_View_Park"
mkdir -p "src/assets/VIGA/Tapsihan_sa_Ilaya"
mkdir -p "src/assets/VIGA/Torres_Inn"
mkdir -p "src/assets/VIGA/Villa_Amacepia_Resort"
```

### Option 2: Using Windows Command Prompt
```cmd
cd Pathfinder-new

md "src\assets\BAGAMANOC\Bagamanoc_Guest_House"
md "src\assets\BAGAMANOC\Boto_Ni_Korakog_(Fertility_Island)"
:: ... (repeat for all folders, replacing / with \)
```

### Option 3: Using VS Code or File Explorer
Create each folder manually by right-clicking in the file explorer.

---

## Complete Folder Listing

### BAGAMANOC (9 folders)
```
src/assets/BAGAMANOC/
├── Bagamanoc_Guest_House/
├── Boto_Ni_Korakog_(Fertility_Island)/
├── Costa_Marina/
├── Dayhagan_Beach_Resort/
├── E-Lounge_Resto_Bar/
├── Emmans_Eatery/
├── Paday_Falls/
├── Palestina_Rolling_Hills/
└── Villa_Felina/
```

### BARAS (16 folders)
```
src/assets/BARAS/
├── 2838_Tea_and_Cafe/
├── Abihao_Point/
├── Alon_Stay/
├── Balacay_Point/
├── Binurong_Point/          ← UPDATED PATH (contains Binurong_Point1.jpg, Binurong_Point2.jpg, Binurong_Point3.jpg)
├── Dela_Villas_Balacay_Inn/
├── East_Coast_Beach_Resort/
├── Jo_Surf_Inn/
├── LAstrolabe/
├── Macutal_Falls/
├── Majestic_Puraran_Beach_Resort/
├── Nyxx_and_Match_Café/
├── Puraran_Surf_Resort/
├── Stanza_De_Benedicto/
├── TasTea/
└── Titaay_Surfers_Inn/
```

### BATO (16 folders)
```
src/assets/BATO/
├── Balongbong_Falls/
├── Batalay_Mangrove_Eco_Park/
├── Bitaogan_Beach/
├── Bote_Lighthouse/
├── Cagraray_Island/
├── Carorian_Wonders/
├── Diocesan_Shrine_of_the_Holy_Cross/
├── Kapet_Tagpuan_Sa_Isla/
├── Little_Bliss_Cafe/
├── Maribina_Falls/
├── Mount_Pinagkaayonan_(Lantad)/
├── Poseidon_Cove_Beach_Resort/
├── Sakahon_Beach/
├── St._Anthony_of_Padua_Parish_Church/
├── St._John_the_Baptist_Church/
└── Villa_Andrea_Inn/
```

### CARAMORAN (4 folders)
```
src/assets/CARAMORAN/
├── Caramoran_Beach_Resort/
├── Guinobatan_Falls/
├── Mamangal_Beach/
└── San_Isidro_Labrador_Church/
```

### GIGMOTO (3 folders)
```
src/assets/GIGMOTO/
├── Gigmoto_Island_Resort/
├── Gigmoto_Lighthouse/
└── Solong_Beach/
```

### PANDAN (3 folders)
```
src/assets/PANDAN/
├── Cabugao_Gamay_Island/
├── Immaculate_Conception_Parish_Church/
└── Pandan_Beach_Resort/
```

### PANGANIBAN (3 folders)
```
src/assets/PANGANIBAN/
├── Panganiban_Beach/
├── Panganiban_Church/
└── Tuwad-Tuwadan_Lagoon/
```

### SAN_ANDRES (3 folders)
```
src/assets/SAN_ANDRES/
├── Nahulugan_Falls/
├── San_Andres_Beach/
└── San_Andres_Church/
```

### SAN_MIGUEL (2 folders)
```
src/assets/SAN_MIGUEL/
├── San_Miguel_Beach/
└── San_Miguel_Church/
```

### VIGA (17 folders)
```
src/assets/VIGA/
├── Black_Alley/
├── Cathys_Spring_Resort/
├── Cogon_Hills/
├── Emerich_Inn/
├── H20_Resort/
├── Isla_Bistro_Café/
├── Jacs_Eatery/
├── Kubo_Suzara/
├── Manuria_Beach_Resort/
├── Minaabat_Beach/
├── Our_Lady_of_Mount_Carmel_Parish_Church/
├── Our_Lady_of_the_Assumption_Parish_Church/
├── Sofeca_Travellers_Inn/
├── Summit_View_Park/
├── Tapsihan_sa_Ilaya/
├── Torres_Inn/
└── Villa_Amacepia_Resort/
```

---

## Tourist Spot to Original Name Mapping

| Municipality | Folder Name | Original Spot Name |
|--------------|-------------|--------------------|
| BAGAMANOC | Bagamanoc_Guest_House | Bagamanoc Guest House |
| BAGAMANOC | Boto_Ni_Korakog_(Fertility_Island) | Boto Ni Korakog (Fertility Island) |
| BAGAMANOC | Costa_Marina | Costa Marina |
| BAGAMANOC | Dayhagan_Beach_Resort | Dayhagan Beach Resort |
| BAGAMANOC | E-Lounge_Resto_Bar | E-Lounge Resto Bar |
| BAGAMANOC | Emmans_Eatery | Emmans Eatery |
| BAGAMANOC | Paday_Falls | Paday Falls |
| BAGAMANOC | Palestina_Rolling_Hills | Palestina Rolling Hills |
| BAGAMANOC | Villa_Felina | Villa Felina |
| BARAS | 2838_Tea_and_Cafe | 2838 Tea and Cafe |
| BARAS | Abihao_Point | Abihao Point |
| BARAS | Alon_Stay | Alon Stay |
| BARAS | Balacay_Point | Balacay Point |
| BARAS | Binurong_Point | Binurong Point |
| BARAS | Dela_Villas_Balacay_Inn | Dela Villa's Balacay Inn |
| BARAS | East_Coast_Beach_Resort | East Coast Beach Resort |
| BARAS | Jo_Surf_Inn | Jo Surf Inn |
| BARAS | LAstrolabe | L'Astrolabe |
| BARAS | Macutal_Falls | Macutal Falls |
| BARAS | Majestic_Puraran_Beach_Resort | Majestic Puraran Beach Resort |
| BARAS | Nyxx_and_Match_Café | Nyxx & Match Café |
| BARAS | Puraran_Surf_Resort | Puraran Surf Resort |
| BARAS | Stanza_De_Benedicto | Stanza De Benedicto |
| BARAS | TasTea | TasTea |
| BARAS | Titaay_Surfers_Inn | Titaay Surfers Inn |
| BATO | Balongbong_Falls | Balongbong Falls |
| BATO | Batalay_Mangrove_Eco_Park | Batalay Mangrove Eco Park |
| BATO | Bitaogan_Beach | Bitaogan Beach |
| BATO | Bote_Lighthouse | Bote Lighthouse |
| BATO | Cagraray_Island | Cagraray Island |
| BATO | Carorian_Wonders | Carorian Wonders |
| BATO | Diocesan_Shrine_of_the_Holy_Cross | Diocesan Shrine of the Holy Cross |
| BATO | Kapet_Tagpuan_Sa_Isla | Kapet Tagpuan Sa Isla |
| BATO | Little_Bliss_Cafe | Little Bliss Cafe |
| BATO | Maribina_Falls | Maribina Falls |
| BATO | Mount_Pinagkaayonan_(Lantad) | Mount Pinagkaayonan (Lantad) |
| BATO | Poseidon_Cove_Beach_Resort | Poseidon Cove Beach Resort |
| BATO | Sakahon_Beach | Sakahon Beach |
| BATO | St._Anthony_of_Padua_Parish_Church | St. Anthony of Padua Parish Church |
| BATO | St._John_the_Baptist_Church | St. John the Baptist Church |
| BATO | Villa_Andrea_Inn | Villa Andrea Inn |
| CARAMORAN | Caramoran_Beach_Resort | Caramoran Beach Resort |
| CARAMORAN | Guinobatan_Falls | Guinobatan Falls |
| CARAMORAN | Mamangal_Beach | Mamangal Beach |
| CARAMORAN | San_Isidro_Labrador_Church | San Isidro Labrador Church |
| GIGMOTO | Gigmoto_Island_Resort | Gigmoto Island Resort |
| GIGMOTO | Gigmoto_Lighthouse | Gigmoto Lighthouse |
| GIGMOTO | Solong_Beach | Solong Beach |
| PANDAN | Cabugao_Gamay_Island | Cabugao Gamay Island |
| PANDAN | Immaculate_Conception_Parish_Church | Immaculate Conception Parish Church |
| PANDAN | Pandan_Beach_Resort | Pandan Beach Resort |
| PANGANIBAN | Panganiban_Beach | Panganiban Beach |
| PANGANIBAN | Panganiban_Church | Panganiban Church |
| PANGANIBAN | Tuwad-Tuwadan_Lagoon | Tuwad-Tuwadan Lagoon |
| SAN_ANDRES | Nahulugan_Falls | Nahulugan Falls |
| SAN_ANDRES | San_Andres_Beach | San Andres Beach |
| SAN_ANDRES | San_Andres_Church | San Andres Church |
| SAN_MIGUEL | San_Miguel_Beach | San Miguel Beach |
| SAN_MIGUEL | San_Miguel_Church | San Miguel Church |
| VIGA | Black_Alley | Black Alley |
| VIGA | Cathys_Spring_Resort | Cathy's Spring Resort |
| VIGA | Cogon_Hills | Cogon Hills |
| VIGA | Emerich_Inn | Emerich Inn |
| VIGA | H20_Resort | H20 Resort |
| VIGA | Isla_Bistro_Café | Isla Bistro Café |
| VIGA | Jacs_Eatery | Jac's Eatery |
| VIGA | Kubo_Suzara | Kubo Suzara |
| VIGA | Manuria_Beach_Resort | Manuria Beach Resort |
| VIGA | Minaabat_Beach | Minaabat Beach |
| VIGA | Our_Lady_of_Mount_Carmel_Parish_Church | Our Lady of Mount Carmel Parish Church |
| VIGA | Our_Lady_of_the_Assumption_Parish_Church | Our Lady of the Assumption Parish Church |
| VIGA | Sofeca_Travellers_Inn | Sofeca Travellers Inn |
| VIGA | Summit_View_Park | Summit View Park |
| VIGA | Tapsihan_sa_Ilaya | Tapsihan sa Ilaya |
| VIGA | Torres_Inn | Torres Inn |
| VIGA | Villa_Amacepia_Resort | Villa Amacepia Resort |

---

## Notes

1. **Folder Naming Convention**: 
   - Spaces replaced with underscores (`_`)
   - Apostrophes (`'`) removed
   - Ampersands (`&`) replaced with `and`
   - Parentheses and hyphens kept as-is

2. **Image Naming**: 
   - Use the format: `{FolderName}1.jpg`, `{FolderName}2.jpg`, etc.
   - Example: `Binurong_Point1.jpg`, `Binurong_Point2.jpg`, `Binurong_Point3.jpg`

3. **Code Changes**:
   - `MapView.jsx` has been updated to use the new municipality-based structure
   - The helper function `getAssetPath(municipality, spotName, filename)` handles path generation
   - Currently only Binurong Point has images configured (3 images)

4. **Next Steps**:
   - Create all folder directories
   - Add images to respective folders
   - Update code to load images for other tourist spots as needed

---

**Last Updated**: January 3, 2026  
**Total Folders**: 76 across 10 municipalities