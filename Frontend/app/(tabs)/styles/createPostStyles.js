import { StyleSheet } from 'react-native'
import { COLORS } from './colors'

export const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.background_blue
  },
  scrollWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 25,
    overflow: 'hidden'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80
  },
  sectionSpacer: {
    height: 20
  },
  inputContainer: {
    marginBottom: 24
  },
  inputLabel: {
    color: COLORS.main_blue,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 8
  },
  inputWrapper: {
    position: 'relative'
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: COLORS.main_blue,
    fontSize: 14,
    backgroundColor: COLORS.background_main_blue
  },
  charCountAbsolute: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    color: COLORS.main_blue,
    fontSize: 12
  },
  editorToolBar: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center'
  },
  editorButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderColor: COLORS.main_blue,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editorButtonText: {
    color: COLORS.main_blue,
    fontWeight: '700',
    fontSize: 16
  },
  verticalSeparator: {
    width: 1,
    height: 35,
    backgroundColor: COLORS.main_blue,
    marginRight: 8
  },
  letterContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  superscript: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    color: COLORS.main_blue
  },

  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
    flexWrap: 'wrap', // Permet le retour à la ligne si besoin
    gap: 8 // Espacement uniforme entre les éléments
  },
  imageWrapper: {
    position: 'relative',
    width: 60,
    height: 60
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.main_blue,
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  deleteButtonText: {
    color: COLORS.background_blue,
    fontSize: 14,
    fontWeight: 'bold'
  },
  addImageButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addImageText: {
    color: COLORS.main_blue,
    fontSize: 24,
    fontWeight: 'bold'
  },
  publishButton: {
    backgroundColor: COLORS.main_blue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 40
  },
  publishButtonText: {
    color: COLORS.background_blue,
    fontSize: 16,
    fontWeight: '700'
  },
  text: {
    color: COLORS.main_blue
  },
  // Styles pour la progression et les erreurs
  progressContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10
  },
  progressText: {
    fontSize: 14,
    color: COLORS.main_blue,
    marginBottom: 5
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.main_blue
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    flex: 1
  },
  clearErrorButton: {
    padding: 5
  },
  clearErrorText: {
    color: '#d32f2f',
    fontWeight: 'bold'
  },
  publishButtonDisabled: {
    opacity: 0.6
  }
})
