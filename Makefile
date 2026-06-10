.PHONY: lint type-check parser test build audit verify check

NPM ?= npm

lint:
	$(NPM) run check

type-check:
	$(NPM) run type-check

parser:
	$(NPM) run test:parser

test:
	$(NPM) test

build:
	$(NPM) run build

audit:
	$(NPM) audit --audit-level=moderate

verify: test

check: verify
