REPORTER = spec

test:
	@/usr/bin/mocha \
		--reporter $(REPORTER) \
		--bail

.PHONY: test
