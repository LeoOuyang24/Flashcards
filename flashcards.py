import re

filename = input("Give me flashcards file path\n")
with open(filename,"r",encoding="utf-8") as my_file:
	x = re.split("-.*\n\n",my_file.read())
	print(x)