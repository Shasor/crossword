# Variables
FILE=crosswordSolver.js
TEST_FILE=test_file.js
TEMP_FILE=temp_file.js

# Règle par défaut
all: combine execute clean

# Étape 1 : Combiner les fichiers dans un fichier temporaire
combine:
	@echo "Combining $(FILE) and $(TEST_FILE) into $(TEMP_FILE)..."
	@cat $(FILE) > $(TEMP_FILE) # Ajouter le contenu de fichier.js
	@echo "// ===== Tests =====\n" >> $(TEMP_FILE) # Ajouter une séparation
	@cat $(TEST_FILE) >> $(TEMP_FILE) # Ajouter le contenu de fichier_test.js

# Étape 2 : Exécuter le fichier temporaire
execute:
	@echo "Executing $(TEMP_FILE) with tests..."
	@node $(TEMP_FILE)

# Étape 3 : Nettoyer les fichiers temporaires
clean:
	@echo "Cleaning up temporary files..."
	@rm -f $(TEMP_FILE)
